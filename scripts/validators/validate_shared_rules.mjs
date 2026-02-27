import path from "path";
import {
  listDirs,
  listFiles,
  pathExists,
  readFile,
} from "../lib/utils.mjs";

const repoRoot = process.cwd();
const skillsRoot = path.join(repoRoot, "skills");
const sharedRulesPath = path.join(repoRoot, "shared", "rules");
const sharedInheritedFromValue = "shared-rules";

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
    const blockLines = lines.slice(start, end);
    const text = blockLines.join("\n");
    blocks.push({
      title,
      startLine: start + 1,
      text,
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

async function validateSharedRules() {
  const errors = [];
  const productionSkills = (await listDirs(skillsRoot))
    .filter((dir) => !dir.startsWith("."))
    .sort();
  const productionSkillSet = new Set(productionSkills);

  if (!await pathExists(sharedRulesPath)) {
    return [`Missing shared rules directory at ${sharedRulesPath}`];
  }

  const ruleFiles = (await listFiles(sharedRulesPath))
    .filter((file) => file.endsWith(".md"))
    .sort();

  if (!ruleFiles.length) {
    return [`No shared rule files found in ${sharedRulesPath}`];
  }

  const idToLocations = new Map();
  for (const file of ruleFiles) {
    const filePath = path.join(sharedRulesPath, file);
    const content = await readFile(filePath);
    if (!content.trim()) {
      errors.push(`${filePath}: file is empty`);
      continue;
    }

    const blocks = findRuleBlocks(content);
    if (!blocks.length) {
      errors.push(`${filePath}: no "## Rule:" blocks found`);
      continue;
    }

    let fileRuleIdCount = 0;
    for (const block of blocks) {
      const ruleId = extractFieldValue(block.text, "Rule ID");
      const priority = extractFieldValue(block.text, "Priority");
      const appliesTo = extractFieldValue(block.text, "Applies to");
      const inlineIn = extractFieldValue(block.text, "Inline in");
      const referenceIn = extractFieldValue(block.text, "Reference in");
      const inheritedFrom = extractFieldValue(block.text, "Inherited from");
      const rationale = extractFieldValue(block.text, "Rationale");
      const hasRequirement = hasSection(block.text, "Requirement");
      const hasForbidden = hasSection(block.text, "Forbidden");

      if (!ruleId) {
        errors.push(
          `${filePath}:${block.startLine}: missing "**Rule ID:**" in rule block "${block.title}"`,
        );
      } else {
        fileRuleIdCount += 1;
        const locations = idToLocations.get(ruleId) || [];
        locations.push(`${filePath}:${block.startLine}`);
        idToLocations.set(ruleId, locations);
      }

      if (!priority) {
        errors.push(
          `${filePath}:${block.startLine}: missing "**Priority:**" in rule block "${block.title}"`,
        );
      }
      if (!appliesTo) {
        errors.push(
          `${filePath}:${block.startLine}: missing "**Applies to:**" in rule block "${block.title}"`,
        );
      } else {
        const appliesList = parseSkillList(appliesTo);

        if (appliesList.length === 0) {
          errors.push(
            `${filePath}:${block.startLine}: "**Applies to:**" must include at least one skill`,
          );
        }

        const unknownApplies = appliesList.filter(
          (skill) => !productionSkillSet.has(skill),
        );
        if (unknownApplies.length) {
          errors.push(
            `${filePath}:${block.startLine}: "**Applies to:**" includes unknown skills: ${unknownApplies.join(", ")}`,
          );
        }
      }

      if (inlineIn) {
        errors.push(
          `${filePath}:${block.startLine}: "**Inline in:**" is deprecated; shared rules are inline-only`,
        );
      }
      if (referenceIn) {
        errors.push(
          `${filePath}:${block.startLine}: "**Reference in:**" is deprecated; shared rules are inline-only`,
        );
      }
      if (!inheritedFrom) {
        errors.push(
          `${filePath}:${block.startLine}: missing "**Inherited from:**" in rule block "${block.title}"`,
        );
      } else if (inheritedFrom !== sharedInheritedFromValue) {
        errors.push(
          `${filePath}:${block.startLine}: "**Inherited from:**" must be "${sharedInheritedFromValue}" in shared rule sources`,
        );
      }
      if (!rationale) {
        errors.push(
          `${filePath}:${block.startLine}: missing "**Rationale:**" in rule block "${block.title}"`,
        );
      }
      if (!hasRequirement) {
        errors.push(
          `${filePath}:${block.startLine}: missing "### Requirement" section in rule block "${block.title}"`,
        );
      }
      if (!hasForbidden) {
        errors.push(
          `${filePath}:${block.startLine}: missing "### Forbidden" section in rule block "${block.title}"`,
        );
      }
    }

    if (fileRuleIdCount === 0) {
      errors.push(`${filePath}: no Rule IDs found`);
    }
  }

  const duplicateIds = [];
  for (const [ruleId, locations] of idToLocations.entries()) {
    if (locations.length > 1) {
      duplicateIds.push({ ruleId, locations });
    }
  }

  for (const dup of duplicateIds) {
    errors.push(
      `Duplicate Rule ID "${dup.ruleId}" found at: ${dup.locations.join(", ")}`,
    );
  }

  return errors;
}

async function run() {
  const errors = await validateSharedRules();
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
