import chalk from "chalk";
import prompt, { PromptObject } from "prompts";
import { program } from "commander";
import semver from "semver";
import fs from "fs";

import { Contract, CONTRACTS, Frontend, FRONTENDS, Subgraph, SUBGRAPHS, ProjectName, UserConfig } from "./types";
import * as show from "./messages";

export async function getUserArgs(): Promise<UserConfig> {
  program
    .argument("[projectName]")
    .option("--contract <contract>")
    .option("--frontend <frontend>")
    .option("--subgraph <subgraph>")
    .option("--install");

  program.parse();

  const options = program.opts();
  const [projectName] = program.args;
  const { contract, frontend, subgraph, install } = options;
  return { contract, frontend, projectName, subgraph, install };
}

export function validateUserInput(args: UserConfig): "error" | "ok" | "none" {
  if (args === null) {
    return "error";
  }
  const { projectName, contract, frontend, subgraph } = args;
  const hasAllOptions = contract !== undefined && frontend !== undefined;
  const hasPartialOptions = contract !== undefined || frontend !== undefined;
  const hasProjectName = projectName !== undefined;
  const hasAllArgs = hasAllOptions && hasProjectName;
  const hasNoArgs = !hasPartialOptions && !hasProjectName;
  const optionsAreValid =
    hasAllOptions && FRONTENDS.includes(frontend) && CONTRACTS.includes(contract) && SUBGRAPHS.includes(subgraph);

  if (hasNoArgs) {
    return "none";
  } else if (hasAllArgs && optionsAreValid) {
    return "ok";
  } else {
    return "error";
  }
}

type Options<T> = { title: string; value: T }[];
const contractOptions: Options<Contract> = [
  { title: "Hardhat", value: "hardhat" },
  { title: "Foundry - Under Develop", value: "foundry" },
  { title: "No contracts", value: "none" },
];
const frontendOptions: Options<Frontend> = [
  { title: "NextJS (React)", value: "nextjs" },
  // { title: "NuxtJS (Vue)", value: "nuxtjs" },
  { title: "Vite (React)", value: "vite" },
  { title: "No frontend", value: "none" },
];
const subgraphOptions: Options<Subgraph> = [
  { title: "The Graph", value: "the-graph" },
  { title: "No subgraph", value: "none" },
];
const userPrompts: PromptObject[] = [
  {
    type: "select",
    name: "contract",
    message: "Select your smart contract development environment",
    choices: contractOptions,
  },
  {
    type: prev => (prev !== "none" ? "select" : null),
    name: "subgraph",
    message: "Select whether you use subgraph or not (TBD)",
    choices: subgraphOptions,
  },
  {
    type: "select",
    name: "frontend",
    message: "Select your frontend framework",
    choices: frontendOptions,
  },
  {
    type: "text",
    name: "projectName",
    message: "Name your project",
    initial: "my-dapp",
  },
  {
    type: "confirm",
    name: "install",
    message: chalk`Run {bold {blue 'yarn install'}} now?`,
    initial: true,
  },
];

export async function getUserInputs() {
  const inputs = await prompt(userPrompts);
  return inputs;
}

export async function showProjectNamePrompt() {
  const [, , , projectName] = userPrompts;
  const project = await prompt([projectName]);
  return project;
}

export function userInputsAreValid(inputs: Partial<UserConfig>): inputs is UserConfig {
  const { contract, frontend, subgraph, projectName } = inputs;
  if ([contract, frontend, subgraph, projectName].includes(undefined)) {
    return false;
  }
  return true;
}

export async function promptAndGetConfig(): Promise<{
  config: UserConfig;
  projectPath: string;
  isFromInputs: boolean;
} | null> {
  let config: UserConfig | null = null;
  let isFromInputs = false;
  // process cli args
  const args = await getUserArgs();
  const argsValid = validateUserInput(args);
  if (argsValid === "error") {
    show.argsError();
    return null;
  } else if (argsValid === "ok") {
    config = args as UserConfig;
  }

  show.welcome();

  const nodeVersion = process.version;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const supportedNodeVersion = require("../package.json").engines.node;
  if (!semver.satisfies(nodeVersion, supportedNodeVersion)) {
    show.unsupportedNodeVersion(supportedNodeVersion);
    return null;
  }

  if (process.platform === "win32") {
    show.windowsWarning();
    return null;
  }

  // Get user input
  if (config === null) {
    const userInputs = await getUserInputs();
    isFromInputs = true;
    if (!userInputsAreValid(userInputs)) {
      throw new Error(`Invalid Inputs: ${JSON.stringify(userInputs)}`);
    }
    config = userInputs;
  }
  const path = projectPath(config.projectName);

  // If given dir exists, warn and exit
  if (fs.existsSync(path)) {
    show.directoryExists(path);
    return null;
  }
  return { config, projectPath: path, isFromInputs };
}

export const projectPath = (projectName: ProjectName) => `${process.cwd()}/${projectName}`;
