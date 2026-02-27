import path from "path";
import {
  listDirs,
  listFiles,
  parseFrontmatter,
  pathExists,
  readFile,
} from "../lib/utils.mjs";

const repoRoot = process.cwd();
const skillsRoot = path.join(repoRoot, "skills");
const sharedPolicySkillPath = path.join(
  repoRoot,
  "shared",
  "SKILL.md",
);
const skillNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const requiredKeys = ["name", "description", "version", "license"];
const requiredMetadataKeys = ["category", "stability"];
const allowedIndexModes = new Set(["inline", "reference"]);
const rulePrefixBySkill = new Map([
  ["react-architecture-detection", "rad-"],
  ["react-placement-and-layering", "rpl-"],
  ["react-reuse-update-new", "rru-"],
  ["react-implementation-discipline", "rid-"],
  ["react-refactoring-progression", "rrp-"],
]);

function findRuleBlocks(content) {
  const lines = content.split("\n");
  const starts = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (/^##\s+Rule:/.test(lines[i])) {
      starts.push(i);
    }
  }

  const blocks = [];
  for (let i = 0; i < starts.length; i += 1) {
    const start = starts[i];
    const end = starts[i + 1] ?? lines.length;
    const title = lines[start].replace(/^##\s+Rule:\s*/, "").trim();
    blocks.push({
      title,
      startLine: start + 1,
      text: lines.slice(start, end).join("\n"),
    });
  }
  return blocks;
}

function extractFieldValue(blockText, fieldName) {
  const regex = new RegExp(`^\\*\\*${fieldName}:\\*\\*\\s*(.+?)\\s*$`, "m");
  const match = blockText.match(regex);
  return match ? match[1].trim() : null;
}

function parseSkillList(rawValue) {
  if (!rawValue) return [];
  return rawValue
    .split(",")
    .map((value) => value.trim().replace(/^`/, "").replace(/`$/, ""))
    .filter(Boolean);
}

function hasSection(blockText, sectionName) {
  const escaped = sectionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`^###\\s+${escaped}\\s*$`, "m");
  return regex.test(blockText);
}

async function validateSkill(skillDir) {
  const skillPath = path.join(skillsRoot, skillDir, "SKILL.md");
  const content = await readFile(skillPath);
  const frontmatter = parseFrontmatter(content);
  if (!frontmatter) {
    return [`Missing frontmatter in ${skillPath}`];
  }

  const errors = [];
  for (const key of requiredKeys) {
    if (!frontmatter[key]) {
      errors.push(`Missing ${key} in ${skillPath}`);
    }
  }

  if (frontmatter.name && !skillNamePattern.test(frontmatter.name)) {
    errors.push(
      `Invalid name "${frontmatter.name}" in ${skillPath}; use lowercase hyphen-case only`,
    );
  }

  if (frontmatter.name !== skillDir) {
    errors.push(
      `Skill folder "${skillDir}" must match frontmatter name "${frontmatter.name}" in ${skillPath}`,
    );
  }

  const metadata = frontmatter.metadata;
  if (!metadata || typeof metadata !== "object") {
    errors.push(`Missing metadata in ${skillPath}`);
  } else {
    for (const key of requiredMetadataKeys) {
      if (!metadata[key]) {
        errors.push(`Missing metadata.${key} in ${skillPath}`);
      }
    }
    if (
      Object.prototype.hasOwnProperty.call(metadata, "tags")
      && typeof metadata.tags !== "string"
    ) {
      errors.push(`metadata.tags must be a comma-delimited string in ${skillPath}`);
    }
  }

  const hasPreApprovedCollisions = Object.prototype.hasOwnProperty.call(
    frontmatter,
    "pre_approved_collisions",
  );
  if (hasPreApprovedCollisions) {
    errors.push(`pre_approved_collisions is only allowed in ${sharedPolicySkillPath}`);
  }

  return errors;
}

async function validateSkillRulePrefixes(skillDir) {
  const errors = [];
  const expectedPrefix = rulePrefixBySkill.get(skillDir);
  if (!expectedPrefix) {
    return errors;
  }

  const rulesPath = path.join(skillsRoot, skillDir, "rules");
  if (!await pathExists(rulesPath)) {
    return errors;
  }

  const ruleFiles = (await listFiles(rulesPath))
    .filter((file) => file.endsWith(".md"))
    .sort();

  for (const file of ruleFiles) {
    const filePath = path.join(rulesPath, file);
    const content = await readFile(filePath);
    const blocks = findRuleBlocks(content);
    if (!blocks.length) {
      errors.push(`${filePath}: no "## Rule:" blocks found`);
      continue;
    }

    for (const block of blocks) {
      const ruleId = extractFieldValue(block.text, "Rule ID");
      const priority = extractFieldValue(block.text, "Priority");
      const appliesTo = extractFieldValue(block.text, "Applies to");
      const covers = extractFieldValue(block.text, "Covers");
      const indexMode = extractFieldValue(block.text, "Index mode");

      if (!ruleId) {
        errors.push(`${filePath}:${block.startLine}: missing "**Rule ID:**"`);
        continue;
      }

      if (!ruleId.startsWith(expectedPrefix)) {
        errors.push(
          `${filePath}:${block.startLine}: Rule ID "${ruleId}" must use "${expectedPrefix}" prefix for skill "${skillDir}"`,
        );
      }

      if (!priority) {
        errors.push(`${filePath}:${block.startLine}: missing "**Priority:**"`);
      }

      if (!appliesTo) {
        errors.push(`${filePath}:${block.startLine}: missing "**Applies to:**"`);
      } else {
        const appliesList = parseSkillList(appliesTo);
        if (!appliesList.includes(skillDir)) {
          errors.push(
            `${filePath}:${block.startLine}: "**Applies to:**" must include "${skillDir}"`,
          );
        }
      }

      if (!covers) {
        errors.push(`${filePath}:${block.startLine}: missing "**Covers:**"`);
      }

      if (!indexMode) {
        errors.push(`${filePath}:${block.startLine}: missing "**Index mode:**"`);
      } else {
        const normalizedMode = indexMode.toLowerCase();
        if (!allowedIndexModes.has(normalizedMode)) {
          errors.push(
            `${filePath}:${block.startLine}: "**Index mode:**" must be one of: ${[...allowedIndexModes].join(", ")}`,
          );
        }
        if (ruleId.endsWith("-output") && normalizedMode !== "inline") {
          errors.push(
            `${filePath}:${block.startLine}: output rule "${ruleId}" must use "**Index mode:** inline"`,
          );
        }
      }

      if (!hasSection(block.text, "Requirement")) {
        errors.push(
          `${filePath}:${block.startLine}: missing "### Requirement" section in "${block.title}"`,
        );
      }
      if (!hasSection(block.text, "Forbidden")) {
        errors.push(
          `${filePath}:${block.startLine}: missing "### Forbidden" section in "${block.title}"`,
        );
      }
    }
  }

  return errors;
}

async function validateSharedPolicy() {
  if (!await pathExists(sharedPolicySkillPath)) {
    return [];
  }

  const content = await readFile(sharedPolicySkillPath);

  const frontmatter = parseFrontmatter(content);
  if (!frontmatter) {
    return [`Missing frontmatter in ${sharedPolicySkillPath}`];
  }

  const errors = [];
  for (const key of requiredKeys) {
    if (!frontmatter[key]) {
      errors.push(`Missing ${key} in ${sharedPolicySkillPath}`);
    }
  }

  if (frontmatter.name && !skillNamePattern.test(frontmatter.name)) {
    errors.push(
      `Invalid name "${frontmatter.name}" in ${sharedPolicySkillPath}; use lowercase hyphen-case only`,
    );
  }

  const metadata = frontmatter.metadata;
  if (!metadata || typeof metadata !== "object") {
    errors.push(`Missing metadata in ${sharedPolicySkillPath}`);
  } else {
    for (const key of requiredMetadataKeys) {
      if (!metadata[key]) {
        errors.push(`Missing metadata.${key} in ${sharedPolicySkillPath}`);
      }
    }
    if (
      Object.prototype.hasOwnProperty.call(metadata, "tags")
      && typeof metadata.tags !== "string"
    ) {
      errors.push(`metadata.tags must be a comma-delimited string in ${sharedPolicySkillPath}`);
    }
  }

  const hasPreApprovedCollisions = Object.prototype.hasOwnProperty.call(
    frontmatter,
    "pre_approved_collisions",
  );
  if (!hasPreApprovedCollisions) {
    errors.push(`Missing pre_approved_collisions in ${sharedPolicySkillPath}`);
  } else {
    const value = frontmatter.pre_approved_collisions;
    const isEmptyArray = (
      Array.isArray(value) && value.length === 0
    ) || value === "[]";
    if (!isEmptyArray) {
      errors.push(`pre_approved_collisions must be [] in ${sharedPolicySkillPath}`);
    }
  }

  return errors;
}

async function listSkillTargets() {
  return (await listDirs(skillsRoot))
    .filter((d) => !d.startsWith("."))
    .sort();
}

async function run() {
  const skillDirs = await listSkillTargets();
  const errors = [];
  for (const skillDir of skillDirs) {
    const skillErrors = await validateSkill(skillDir);
    errors.push(...skillErrors);
    const skillRulePrefixErrors = await validateSkillRulePrefixes(skillDir);
    errors.push(...skillRulePrefixErrors);
  }
  const sharedPolicyErrors = await validateSharedPolicy();
  errors.push(...sharedPolicyErrors);

  if (errors.length) {
    for (const err of errors) {
      process.stderr.write(`${err}\n`);
    }
    process.exit(1);
  }
}

run().catch((err) => {
  process.stderr.write(`${err.message}\n`);
  process.exit(1);
});
