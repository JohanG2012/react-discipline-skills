import fs from "fs/promises";
import path from "path";
import {
  collectUnsupportedSchemaKeywords,
  validateSchema,
} from "../tools/build/schema_validator.mjs";

const repoRoot = process.cwd();
const fixturesRoot = path.join(repoRoot, "scripts", "fixtures", "handoffs");

const stageFiles = [
  "skill1_output.json",
  "skill2_output.json",
  "skill3_output.json",
  "skill4_input.json",
];

const fixtureExpectations = {
  success: {
    schemaShouldPass: true,
    pipelineShouldPass: true,
  },
  validation_error: {
    schemaShouldPass: false,
    pipelineShouldPass: null,
  },
  dependency_error: {
    schemaShouldPass: true,
    pipelineShouldPass: false,
  },
};

const schemaPaths = {
  skill1_output: path.join(repoRoot, "skills", "react_architecture_detection", "schemas", "output.schema.json"),
  skill2_output: path.join(repoRoot, "skills", "react_placement_and_layering", "schemas", "output.schema.json"),
  skill3_output: path.join(repoRoot, "skills", "react_reuse_update_new", "schemas", "output.schema.json"),
  skill4_input: path.join(repoRoot, "scripts", "schemas", "skill4_input.schema.json"),
};

function usage() {
  return [
    "Usage:",
    "  node scripts/validate_handoffs.mjs",
    "  node scripts/validate_handoffs.mjs --set <success|validation_error|dependency_error>",
    "",
    "Default mode validates all fixture sets against expected outcomes.",
    "--set mode runs strict validation for a single fixture set.",
  ].join("\n");
}

function parseArgs(argv) {
  let setName = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      return { help: true, setName: null };
    }
    if (arg === "--set") {
      setName = argv[i + 1] ?? null;
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return { help: false, setName };
}

function rel(filePath) {
  return path.relative(repoRoot, filePath);
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function loadSchema(schemaPath, label) {
  const exists = await pathExists(schemaPath);
  if (!exists) {
    throw new Error(`Missing schema for ${label}: ${schemaPath}`);
  }

  const schema = await readJson(schemaPath);
  const schemaKeywordErrors = collectUnsupportedSchemaKeywords(schema, "$");
  if (schemaKeywordErrors.length) {
    const firstErrors = schemaKeywordErrors.slice(0, 3).join("\n  - ");
    throw new Error(
      `Unsupported schema keywords in ${rel(schemaPath)}:\n  - ${firstErrors}`,
    );
  }

  return {
    label,
    schemaPath,
    schema,
  };
}

function formatSchemaFailure({ fixturePath, schemaPath, errors }) {
  const lines = [
    `[${rel(fixturePath)}] failed schema validation against ${rel(schemaPath)}`,
  ];
  for (const err of errors.slice(0, 3)) {
    lines.push(`  - ${err}`);
  }
  if (errors.length > 3) {
    lines.push(`  - ... ${errors.length - 3} more`);
  }
  return lines;
}

function validatePayloadWithSchema({ payload, fixturePath, schemaDef }) {
  const validationErrors = validateSchema(schemaDef.schema, payload, "$", schemaDef.schema);
  if (validationErrors.length === 0) {
    return [];
  }
  return formatSchemaFailure({
    fixturePath,
    schemaPath: schemaDef.schemaPath,
    errors: validationErrors,
  });
}

async function loadFixtureSet(setName) {
  const setPath = path.join(fixturesRoot, setName);
  const exists = await pathExists(setPath);
  if (!exists) {
    throw new Error(`Fixture set not found: ${setPath}`);
  }

  const payloads = {};
  const paths = {};
  for (const fileName of stageFiles) {
    const fixturePath = path.join(setPath, fileName);
    const fixtureExists = await pathExists(fixturePath);
    if (!fixtureExists) {
      throw new Error(`Missing fixture file: ${fixturePath}`);
    }
    payloads[fileName] = await readJson(fixturePath);
    paths[fileName] = fixturePath;
  }

  return { payloads, paths };
}

function validateFixtureSetSchemas({ setPayloads, setPaths, schemas }) {
  const schemaErrors = [];

  const stageToSchema = [
    ["skill1_output.json", schemas.skill1_output],
    ["skill2_output.json", schemas.skill2_output],
    ["skill3_output.json", schemas.skill3_output],
    ["skill4_input.json", schemas.skill4_input],
  ];

  for (const [fixtureFile, schemaDef] of stageToSchema) {
    const errors = validatePayloadWithSchema({
      payload: setPayloads[fixtureFile],
      fixturePath: setPaths[fixtureFile],
      schemaDef,
    });
    if (errors.length) {
      schemaErrors.push(...errors);
      return schemaErrors;
    }
  }

  const skill4Input = setPayloads["skill4_input.json"];

  const nestedDetectionErrors = validatePayloadWithSchema({
    payload: skill4Input.detection_result,
    fixturePath: setPaths["skill4_input.json"],
    schemaDef: schemas.skill1_output,
  });
  if (nestedDetectionErrors.length) {
    schemaErrors.push(
      `[${rel(setPaths["skill4_input.json"])}] skill4_input.detection_result is invalid`,
      ...nestedDetectionErrors.map((line) => `  ${line}`),
    );
    return schemaErrors;
  }

  const nestedRevisedPlanErrors = validatePayloadWithSchema({
    payload: skill4Input.revised_plan,
    fixturePath: setPaths["skill4_input.json"],
    schemaDef: schemas.skill3_revised_plan,
  });
  if (nestedRevisedPlanErrors.length) {
    schemaErrors.push(
      `[${rel(setPaths["skill4_input.json"])}] skill4_input.revised_plan is invalid`,
      ...nestedRevisedPlanErrors.map((line) => `  ${line}`),
    );
    return schemaErrors;
  }

  return schemaErrors;
}

function runPipelineAssertions(setPayloads) {
  const errors = [];

  const skill1 = setPayloads["skill1_output.json"];
  const skill2 = setPayloads["skill2_output.json"];
  const skill3 = setPayloads["skill3_output.json"];
  const skill4 = setPayloads["skill4_input.json"];

  if (skill1.result_type !== "detection_result") {
    errors.push("skill1_output.result_type must be detection_result for pipeline handoff");
  }
  if (skill2.result_type !== "placement_plan") {
    errors.push("skill2_output.result_type must be placement_plan for pipeline handoff");
  }
  if (skill3.result_type !== "decision_plan") {
    errors.push("skill3_output.result_type must be decision_plan for pipeline handoff");
  }

  if ("reuse_decisions" in skill4) {
    errors.push("skill4_input must not include reuse_decisions");
  }

  if (
    typeof skill1?.api?.home === "string"
    && skill1.api.home !== "unknown"
    && typeof skill2?.canonical_endpoint_layer === "string"
  ) {
    if (skill2.canonical_endpoint_layer !== skill1.api.home) {
      errors.push("skill2_output.canonical_endpoint_layer must match skill1_output.api.home");
    }
  }

  if (isObject(skill4.detection_result) && !deepEqual(skill4.detection_result, skill1)) {
    errors.push("skill4_input.detection_result must match skill1_output payload");
  }

  if (isObject(skill3.revised_plan) && isObject(skill4.revised_plan)) {
    if (!deepEqual(skill4.revised_plan, skill3.revised_plan)) {
      errors.push("skill4_input.revised_plan must match skill3_output.revised_plan");
    }
  }

  return errors;
}

async function runSetStrict(setName, schemas) {
  const { payloads, paths } = await loadFixtureSet(setName);
  const schemaErrors = validateFixtureSetSchemas({
    setPayloads: payloads,
    setPaths: paths,
    schemas,
  });
  if (schemaErrors.length) {
    for (const error of schemaErrors) {
      process.stderr.write(`${error}\n`);
    }
    process.exit(1);
  }

  const pipelineErrors = runPipelineAssertions(payloads);
  if (pipelineErrors.length) {
    for (const error of pipelineErrors) {
      process.stderr.write(`${error}\n`);
    }
    process.exit(1);
  }
}

async function runExpectationMode(schemas) {
  for (const [setName, expectation] of Object.entries(fixtureExpectations)) {
    const { payloads, paths } = await loadFixtureSet(setName);
    const schemaErrors = validateFixtureSetSchemas({
      setPayloads: payloads,
      setPaths: paths,
      schemas,
    });

    if (expectation.schemaShouldPass && schemaErrors.length) {
      process.stderr.write(`Fixture set ${setName} was expected to pass schema validation, but failed:\n`);
      for (const error of schemaErrors) {
        process.stderr.write(`${error}\n`);
      }
      process.exit(1);
    }

    if (!expectation.schemaShouldPass && schemaErrors.length === 0) {
      process.stderr.write(`Fixture set ${setName} was expected to fail schema validation, but passed.\n`);
      process.exit(1);
    }

    if (expectation.pipelineShouldPass === null) {
      continue;
    }

    const pipelineErrors = runPipelineAssertions(payloads);
    if (expectation.pipelineShouldPass && pipelineErrors.length) {
      process.stderr.write(`Fixture set ${setName} was expected to pass pipeline assertions, but failed:\n`);
      for (const error of pipelineErrors) {
        process.stderr.write(`${error}\n`);
      }
      process.exit(1);
    }

    if (!expectation.pipelineShouldPass && pipelineErrors.length === 0) {
      process.stderr.write(`Fixture set ${setName} was expected to fail pipeline assertions, but passed.\n`);
      process.exit(1);
    }
  }
}

async function loadSchemas() {
  const skill1Schema = await loadSchema(schemaPaths.skill1_output, "skill1_output");
  const skill2Schema = await loadSchema(schemaPaths.skill2_output, "skill2_output");
  const skill3Schema = await loadSchema(schemaPaths.skill3_output, "skill3_output");
  const skill4InputSchema = await loadSchema(schemaPaths.skill4_input, "skill4_input");

  const revisedPlanSchema = {
    $ref: "#/$defs/revised_plan",
    $defs: skill3Schema.schema.$defs,
  };

  const revisedPlanKeywordErrors = collectUnsupportedSchemaKeywords(revisedPlanSchema, "$");
  if (revisedPlanKeywordErrors.length) {
    const firstErrors = revisedPlanKeywordErrors.slice(0, 3).join("\n  - ");
    throw new Error(
      `Unsupported schema keywords in derived revised_plan schema:\n  - ${firstErrors}`,
    );
  }

  return {
    skill1_output: skill1Schema,
    skill2_output: skill2Schema,
    skill3_output: skill3Schema,
    skill4_input: skill4InputSchema,
    skill3_revised_plan: {
      label: "skill3_revised_plan",
      schemaPath: `${rel(schemaPaths.skill3_output)}#/$defs/revised_plan`,
      schema: revisedPlanSchema,
    },
  };
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  if (args.setName && !(args.setName in fixtureExpectations)) {
    throw new Error(`Unknown fixture set: ${args.setName}`);
  }

  const schemas = await loadSchemas();

  if (args.setName) {
    await runSetStrict(args.setName, schemas);
    return;
  }

  await runExpectationMode(schemas);
}

run().catch((err) => {
  process.stderr.write(`${err.message}\n`);
  process.exit(1);
});
