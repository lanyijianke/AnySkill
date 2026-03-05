#!/usr/bin/env node

/**
 * generate-index.js
 * 
 * Recursively scans the skills/ directory for skill folders containing SKILL.md
 * and produces index.json.
 * 
 * Supports both flat and nested (categorized) layouts:
 *   skills/my-skill/SKILL.md              → category: ""
 *   skills/dev/my-skill/SKILL.md          → category: "dev"
 *   skills/dev/sub/my-skill/SKILL.md      → category: "dev/sub"
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
 * Recursively find all SKILL.md files under a directory.
 * Returns an array of { skillDir, relPath } where:
 *   skillDir = absolute path to the directory containing SKILL.md
 *   relPath  = path relative to SKILLS_DIR (e.g. "dev/my-skill")
 */
function findSkills(dir, baseDir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === '.git') continue;

    const fullPath = path.join(dir, entry.name);
    const skillMd = path.join(fullPath, 'SKILL.md');

    if (fs.existsSync(skillMd)) {
      // This directory IS a skill (has SKILL.md)
      results.push({
        skillDir: fullPath,
        relPath: path.relative(baseDir, fullPath),
      });
    } else {
      // This directory might be a category folder — recurse into it
      results.push(...findSkills(fullPath, baseDir));
    }
  }

  return results;
}

function main() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error(`Skills directory not found: ${SKILLS_DIR}`);
    process.exit(1);
  }

  const skills = findSkills(SKILLS_DIR, SKILLS_DIR);
  const index = [];

  for (const { skillDir, relPath } of skills) {
    const skillMd = path.join(skillDir, 'SKILL.md');
    const content = fs.readFileSync(skillMd, 'utf-8');
    const frontmatter = extractFrontmatter(content);

    if (!frontmatter || !frontmatter.name) {
      console.warn(`⚠️  Skipping ${relPath}/SKILL.md: missing or invalid frontmatter`);
      continue;
    }

    const allFiles = collectFiles(skillDir, SKILLS_DIR);
    allFiles.sort();

    // Determine category from path segments
    const segments = relPath.split(path.sep);
    const skillName = segments.pop(); // last segment is the skill folder name
    const category = segments.join('/'); // remaining segments form the category

    index.push({
      name: frontmatter.name,
      description: frontmatter.description || '',
      category,
      path: relPath,
      file: `${relPath}/SKILL.md`,
      files: allFiles,
    });

    const label = category ? `${category}/` : '';
    console.log(`✅ ${frontmatter.name} (${label}${skillName}/) — ${allFiles.length} file(s)`);
  }

  index.sort((a, b) => a.name.localeCompare(b.name));

  // Collect unique categories for the summary
  const categories = [...new Set(index.map(s => s.category).filter(Boolean))];

  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2) + '\n', 'utf-8');

  console.log(`\n📦 Generated index.json with ${index.length} skills.`);
  if (categories.length > 0) {
    console.log(`📂 Categories: ${categories.sort().join(', ')}`);
  }
}

main();
