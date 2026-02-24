import path from "path";
import {
  listDirs,
  parseFrontmatter,
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

async function validateSharedPolicy() {
  let content;
  try {
    content = await readFile(sharedPolicySkillPath);
  } catch {
    return [`Missing shared baseline SKILL.md at ${sharedPolicySkillPath}`];
  }

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
