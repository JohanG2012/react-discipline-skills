import path from "path";
import {
  listDirs,
  listFiles,
  pathExists,
  readFile,
} from "../lib/utils.mjs";
import {
  collectUnsupportedSchemaKeywords,
  validateSchema,
} from "../lib/schema_validator.mjs";

const repoRoot = process.cwd();
const skillsRoot = path.join(repoRoot, "skills");

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
      continue;
    }
    seen.add(value);
  }
  return [...duplicates];
}

function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const value of a) {
    if (!b.has(value)) return false;
  }
  return true;
}

function validateReuseDecisionExample({ filePath, data }) {
  const errors = [];
  if (data?.result_type !== "decision_plan") {
    return errors;
  }

  const revisedPlan = data?.revised_plan;
  if (!isObject(revisedPlan)) {
    return errors;
  }

  const fileActions = Array.isArray(revisedPlan.file_actions)
    ? revisedPlan.file_actions
    : [];
  const decisions = Array.isArray(revisedPlan.decisions)
    ? revisedPlan.decisions
    : [];

  const fileActionIds = fileActions
    .map((item) => item?.needed_artifact_id)
    .filter((value) => typeof value === "string" && value.length > 0);
  const decisionIds = decisions
    .map((item) => item?.needed_artifact_id)
    .filter((value) => typeof value === "string" && value.length > 0);

  for (const duplicate of duplicateValues(fileActionIds)) {
    errors.push(
      `${filePath}: revised_plan.file_actions has duplicate needed_artifact_id "${duplicate}"`,
    );
  }
  for (const duplicate of duplicateValues(decisionIds)) {
    errors.push(
      `${filePath}: revised_plan.decisions has duplicate needed_artifact_id "${duplicate}"`,
    );
  }

  const fileActionIdSet = new Set(fileActionIds);
  const decisionIdSet = new Set(decisionIds);
  if (!setsEqual(fileActionIdSet, decisionIdSet)) {
    errors.push(
      `${filePath}: revised_plan.file_actions and revised_plan.decisions must match one-to-one by needed_artifact_id`,
    );
  }

  if (
    Array.isArray(revisedPlan.move_actions)
    && revisedPlan.move_actions.length > 3
    && revisedPlan.migration_scope_enabled !== true
  ) {
    errors.push(
      `${filePath}: revised_plan.move_actions must be <= 3 unless migration_scope_enabled=true`,
    );
  }

  if (Array.isArray(revisedPlan.placement_overrides)) {
    const fileActionById = new Map();
    for (const action of fileActions) {
      if (
        isObject(action)
        && typeof action.needed_artifact_id === "string"
        && action.needed_artifact_id.length > 0
      ) {
        fileActionById.set(action.needed_artifact_id, action);
      }
    }

    for (const override of revisedPlan.placement_overrides) {
      if (!isObject(override)) continue;
      const id = override.needed_artifact_id;
      if (typeof id !== "string" || id.length === 0) continue;

      const action = fileActionById.get(id);
      if (!action) {
        errors.push(
          `${filePath}: placement_overrides entry "${id}" has no matching file_actions entry`,
        );
        continue;
      }

      if (typeof override.revised_path === "string" && action.path !== override.revised_path) {
        errors.push(
          `${filePath}: placement_overrides "${id}" revised_path must match file_actions path`,
        );
      }
      if (typeof override.revised_layer === "string" && action.layer !== override.revised_layer) {
        errors.push(
          `${filePath}: placement_overrides "${id}" revised_layer must match file_actions layer`,
        );
      }
    }
  }

  return errors;
}

async function validateSkill(skillDir) {
  const skillPath = path.join(skillsRoot, skillDir);
  const schemaPath = path.join(skillPath, "schemas", "output.schema.json");
  const schemaExists = await pathExists(schemaPath);
  if (!schemaExists) return [];

  const schema = JSON.parse(await readFile(schemaPath));
  const schemaKeywordErrors = collectUnsupportedSchemaKeywords(schema, "$");
  const errors = schemaKeywordErrors.map((err) => `${schemaPath}: ${err}`);

  const examplesPath = path.join(skillPath, "examples");
  const exampleFiles = (await listFiles(examplesPath)).filter((f) => f.endsWith(".json"));
  const examplePayloads = [];
  for (const file of exampleFiles) {
    const filePath = path.join(examplesPath, file);
    const data = JSON.parse(await readFile(filePath));
    examplePayloads.push({ filePath, data });
    const validationErrors = validateSchema(schema, data, "$", schema);
    if (validationErrors.length) {
      for (const err of validationErrors) {
        errors.push(`${filePath}: ${err}`);
      }
    }

    if (skillDir === "react-reuse-update-new") {
      errors.push(
        ...validateReuseDecisionExample({ filePath, data }),
      );
    }
  }

  const resultTypeEnum = schema?.properties?.result_type?.enum;
  if (Array.isArray(resultTypeEnum) && resultTypeEnum.length) {
    const resultTypesInExamples = new Set(
      examplePayloads
        .map(({ data }) => data.result_type)
        .filter((value) => typeof value === "string"),
    );

    for (const resultType of resultTypeEnum) {
      if (!resultTypesInExamples.has(resultType)) {
        errors.push(
          `${skillPath}: missing example for result_type "${resultType}"`,
        );
      }
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
