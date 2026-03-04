#!/usr/bin/env node

/**
 * generate-index.js
 * 
 * Scans the skills/ directory for skill folders and produces index.json.
 * 
 * Expected structure:
 *   skills/my-skill/SKILL.md  (entry point, required)
 *   skills/my-skill/scripts/  (optional sub-files)
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
 * Returns paths relative to SKILLS_DIR.
 */
function collectFiles(dir, baseDir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath, baseDir));
    } else if (entry.isFile()) {
      results.push(path.relative(baseDir, fullPath));
    }
  }

  return results;
}

function main() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error(`Skills directory not found: ${SKILLS_DIR}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
  const index = [];

  for (const entry of entries) {
    // Only support folder mode: skills/{name}/SKILL.md
    if (!entry.isDirectory()) {
      console.warn(`⚠️  Skipping ${entry.name}: not a folder (flat .md files are no longer supported)`);
      continue;
    }

    const skillMd = path.join(SKILLS_DIR, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillMd)) {
      console.warn(`⚠️  Skipping folder ${entry.name}/: no SKILL.md found`);
      continue;
    }

    const content = fs.readFileSync(skillMd, 'utf-8');
    const frontmatter = extractFrontmatter(content);

    if (!frontmatter || !frontmatter.name) {
      console.warn(`⚠️  Skipping ${entry.name}/SKILL.md: missing or invalid frontmatter (need at least 'name')`);
      continue;
    }

    // Recursively collect all files in this skill folder
    const allFiles = collectFiles(path.join(SKILLS_DIR, entry.name), SKILLS_DIR);
    // Sort for deterministic output
    allFiles.sort();

    index.push({
      name: frontmatter.name,
      description: frontmatter.description || '',
      file: `${entry.name}/SKILL.md`,
      files: allFiles,
    });

    console.log(`✅ ${frontmatter.name} (${entry.name}/) — ${allFiles.length} file(s)`);
  }

  // Sort alphabetically by name
  index.sort((a, b) => a.name.localeCompare(b.name));

  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2) + '\n', 'utf-8');
  console.log(`\n📦 Generated index.json with ${index.length} skills.`);
}

main();
