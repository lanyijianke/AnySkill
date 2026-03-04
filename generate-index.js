#!/usr/bin/env node

/**
 * generate-index.js
 * 
 * Scans skills/ directory recursively for skill folders and produces index.json.
 * 
 * Expected structure:
 *   skills/presets/{category}/{skill-name}/SKILL.md
 *   skills/custom/{skill-name}/SKILL.md
 * 
 * Each SKILL.md must have YAML frontmatter with at least a 'name' field.
 * 
 * Used by GitHub Actions (build-index.yml) on every push to skills/.
 * Can also be run locally: `node generate-index.js`
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, 'skills');
const INDEX_FILE = path.join(__dirname, 'index.json');

/**
 * Extract YAML frontmatter from a markdown string.
 * Returns { name, description, ... } or null if no valid frontmatter.
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const result = {};

  for (const line of yaml.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.substring(0, colonIdx).trim();
    const value = line.substring(colonIdx + 1).trim();
    result[key] = value.replace(/^["']|["']$/g, '');
  }

  return result;
}

/**
 * Recursively collect all file paths within a directory.
 * Returns paths relative to the given baseDir.
 */
function collectFiles(dir, baseDir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === '.gitkeep') continue;
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath, baseDir));
    } else if (entry.isFile()) {
      results.push(path.relative(baseDir, fullPath));
    }
  }

  return results;
}

/**
 * Recursively find all skill folders (folders containing SKILL.md) under a root dir.
 * Returns an array of { skillDir, relativePath } entries.
 */
function findSkillFolders(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;

    const fullPath = path.join(dir, entry.name);
    const skillMd = path.join(fullPath, 'SKILL.md');

    if (fs.existsSync(skillMd)) {
      // This is a skill folder
      results.push(fullPath);
    } else {
      // Recurse deeper (e.g., into presets/core-enhancement/)
      results.push(...findSkillFolders(fullPath));
    }
  }

  return results;
}

function main() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error(`Skills directory not found: ${SKILLS_DIR}`);
    process.exit(1);
  }

  const skillFolders = findSkillFolders(SKILLS_DIR);
  const index = [];

  for (const skillDir of skillFolders) {
    const skillMd = path.join(skillDir, 'SKILL.md');
    const content = fs.readFileSync(skillMd, 'utf-8');
    const frontmatter = extractFrontmatter(content);
    const skillName = path.basename(skillDir);
    const relativePath = path.relative(SKILLS_DIR, skillDir);
    const category = path.relative(SKILLS_DIR, path.dirname(skillDir));

    if (!frontmatter || !frontmatter.name) {
      console.warn(`⚠️  Skipping ${relativePath}/SKILL.md: missing or invalid frontmatter (need at least 'name')`);
      continue;
    }

    // Recursively collect all files in this skill folder
    const allFiles = collectFiles(skillDir, SKILLS_DIR);
    allFiles.sort();

    index.push({
      name: frontmatter.name,
      description: frontmatter.description || '',
      path: relativePath,
      category: category,
      file: `${relativePath}/SKILL.md`,
      files: allFiles,
    });

    console.log(`✅ ${frontmatter.name} (${relativePath}/) — ${allFiles.length} file(s)`);
  }

  // Sort alphabetically by name
  index.sort((a, b) => a.name.localeCompare(b.name));

  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2) + '\n', 'utf-8');
  console.log(`\n📦 Generated index.json with ${index.length} skills.`);
}

main();
