import chalk from "chalk";
import { Contract, CONTRACTS_DISPLAY, Frontend, FRONTENDS_DISPLAY, ProjectName } from "./types";

export const messages = (...args: unknown[]) => console.log(...args);

export const welcome = () =>
  messages(chalk`{blue ======================================================}
👋 {bold {green Welcome to create-evm-app!}} Learn more: https://docs.create-evm-app.org/
🔧 Let's get your dApp ready.
{blue ======================================================}`);

export const setupFailed = () =>
  messages(chalk`{bold {red ==========================================}}
{red ⛔️ There was a problem during project setup}.
Please refer to https://github.com/hangleang/create-evm-app README to troubleshoot.
Notice: some platforms aren't supported (yet).
{bold {red ==========================================}}`);

export const successContractToText = (contract: Contract) =>
  contract === "none" ? "" : chalk`with smart contract in {bold ${CONTRACTS_DISPLAY[contract]}}`;
export const successFrontendToText = (frontend: Frontend) =>
  frontend === "none" ? "" : chalk`and frontend in {bold ${FRONTENDS_DISPLAY[frontend]}}`;
export const setupSuccess = (projectName: ProjectName, contract: Contract, frontend: Frontend, install: boolean) =>
  messages(chalk`
{green ======================================================}
✅  Success! Created '${projectName}'
  ${successContractToText(contract)} ${successFrontendToText(frontend)}.
${
  contract === "foundry"
    ? chalk`🦀 If you are new to Foundry please visit {bold {green https://getfoundry.sh/ }}\n`
    : ""
}
  {bold {bgYellow {black Your next steps}}}:
   - {inverse Navigate to your project}:
         {blue cd {bold ${projectName}}}
   ${
     !install
       ? chalk`- {inverse Install all dependencies}
         {blue pnpm {bold install}}`
       : "Then:"
   }
   - {inverse Test your contract} in ${CONTRACTS_DISPLAY[contract]} Sandbox:
         {blue pnpm {bold test}}
   - {inverse Deploy your contract} to local network:
         {blue pnpm {bold deploy}}
   ${
     frontend !== "none"
       ? chalk`- {inverse Start your frontend}:
         {blue pnpm {bold dev}}\n`
       : ""
   }
🧠 Read {bold {greenBright README.md}} to explore further.`);

export const argsError = () =>
  messages(chalk`{red Arguments error}
Run {blue npx create-evm-app} without arguments, or use:
npx create-evm-app <projectName> --contract hardhat|foundry|none --frontend nextjs|vite|none --subgraph the-graph|none`);

export const unsupportedNodeVersion = (supported: string) =>
  messages(chalk`{red We support node.js version ${supported} or later}`);

export const windowsWarning = () =>
  messages(chalk`{bgYellow {black Notice: On Win32 please use WSL (Windows Subsystem for Linux).}}
https://docs.microsoft.com/en-us/windows/wsl/install
Exiting now.`);

export const directoryExists = (dirName: string) => messages(chalk`{red This directory already exists! ${dirName}}`);

export const creatingApp = () => messages(chalk`\nCreating a new {bold dApp}`);

export const depsInstall = () =>
  messages(chalk`
{green Installing dependencies, this might take a while...}
`);

export const depsInstallError = () => messages(chalk.red("Error installing dependencies"));
