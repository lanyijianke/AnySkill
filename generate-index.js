#!/usr/bin/env node

/**
 * generate-index.js
 * 
 * Scans the skills/ directory for skill definitions and produces index.json.
 * 
 * Supports TWO structures:
 *   1. Flat file:   skills/my-skill.md
 *   2. Folder:      skills/my-skill/SKILL.md  (can include scripts/, references, etc.)
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

function main() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error(`Skills directory not found: ${SKILLS_DIR}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
  const index = [];

  for (const entry of entries) {
    let filePath;
    let relativePath; // path relative to skills/ for the URL

    if (entry.isDirectory()) {
      // Folder mode: skills/my-skill/SKILL.md
      const skillMd = path.join(SKILLS_DIR, entry.name, 'SKILL.md');
      if (!fs.existsSync(skillMd)) {
        console.warn(`⚠️  Skipping folder ${entry.name}/: no SKILL.md found`);
        continue;
      }
      filePath = skillMd;
      relativePath = `${entry.name}/SKILL.md`;
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // Flat mode: skills/my-skill.md
      filePath = path.join(SKILLS_DIR, entry.name);
      relativePath = entry.name;
    } else {
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatter = extractFrontmatter(content);

    if (!frontmatter || !frontmatter.name) {
      console.warn(`⚠️  Skipping ${relativePath}: missing or invalid frontmatter (need at least 'name')`);
      continue;
    }

    index.push({
      name: frontmatter.name,
      description: frontmatter.description || '',
      file: relativePath,
    });

    console.log(`✅ ${frontmatter.name} (${relativePath})`);
  }

  // Sort alphabetically by name
  index.sort((a, b) => a.name.localeCompare(b.name));

  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2) + '\n', 'utf-8');
  console.log(`\n📦 Generated index.json with ${index.length} skills.`);
}

main();
