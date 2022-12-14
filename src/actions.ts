import { CreateProjectParams } from "./types";
import * as messages from "./messages";
import spawn from "cross-spawn";
import fs from "fs";
import { ncp } from "ncp";
import path from "path";
import { buildPackageJson } from "./package.json";
import { buildWorkspace } from "./pnpm-workspace.yaml";
import rmdir from "rimraf";

export async function createProject({
  contract,
  frontend,
  subgraph,
  projectPath,
  projectName,
  verbose,
  rootDir,
}: CreateProjectParams): Promise<boolean> {
  // Create files in the project folder
  await createFiles({ contract, frontend, subgraph, projectName, projectPath, verbose, rootDir });

  // Create package.json
  const packageJson = buildPackageJson({ contract, frontend, subgraph, projectName });
  fs.writeFileSync(path.resolve(projectPath, "package.json"), Buffer.from(JSON.stringify(packageJson, null, 2)));

  // Create pnpm-workspace.yaml
  const workspaceYaml = buildWorkspace({ contract, frontend, subgraph });
  fs.writeFileSync(path.resolve(projectPath, "pnpm-workspace.yaml"), Buffer.from(workspaceYaml));

  return true;
}

// TODO: extract subgraph
export async function createFiles({ contract, frontend, projectPath, verbose, rootDir }: CreateProjectParams) {
  // skip build artifacts and symlinks
  const skip = ["artifacts", "build", "cache", "dist", "out", "node_modules"];

  // shared files
  const sourceSharedDir = path.resolve(rootDir, "shared");
  await copyDir(sourceSharedDir, projectPath, { verbose, skip: [] });

  // copy contract files
  const sourceContractDir = path.resolve(rootDir, "contracts", contract);
  const targetContractDir = path.resolve(projectPath, "contract");
  fs.mkdirSync(targetContractDir, { recursive: true });
  await copyDir(sourceContractDir, targetContractDir, {
    verbose,
    skip: skip.map(f => path.join(sourceContractDir, f)),
  });
  rmdir(path.resolve(targetContractDir, ".git"), err => {
    if (err) {
      messages.customError(err.message);
    }
  });

  // copy frontend
  if (frontend !== "none") {
    const sourceFrontendDir = path.resolve(`${rootDir}/frontend/${frontend}`);
    const targetFrontendDir = path.resolve(`${projectPath}/frontend`);
    fs.mkdirSync(targetFrontendDir, { recursive: true });
    await copyDir(sourceFrontendDir, targetFrontendDir, {
      verbose,
      skip: skip.map(f => path.join(sourceFrontendDir, f)),
    });
    rmdir(path.resolve(targetContractDir, ".git"), err => {
      if (err) {
        messages.customError(err.message);
      }
    });
  }
}

// Wrap `ncp` tool to wait for the copy to finish when using `await`
// Allow passing `skip` variable to skip copying an array of filenames
export function copyDir(source: string, dest: string, { skip, verbose }: { skip: string[]; verbose: boolean }) {
  return new Promise<void>((resolve, reject) => {
    const copied: string[] = [];
    const skipped: string[] = [];
    const filter =
      skip &&
      function (filename: string) {
        const shouldCopy = !skip.find(f => filename.includes(f));
        shouldCopy ? copied.push(filename) : skipped.push(filename);
        return !skip.find(f => filename.includes(f));
      };

    ncp(source, dest, { filter }, err => {
      if (err) {
        reject(err);
        return;
      }

      if (verbose) {
        console.log("Copied:");
        copied.forEach(f => console.log("  " + f));
        console.log("Skipped:");
        skipped.forEach(f => console.log("  " + f));
      }

      resolve();
    });
  });
}

export async function initializeGit(projectPath: string) {
  messages.initGit();
  const commandArgs = ["init"];
  await new Promise<void>((resolve, reject) =>
    spawn("git", commandArgs, {
      cwd: projectPath,
      stdio: "ignore",
    }).on("close", (code: number) => {
      if (code !== 0) {
        messages.initGitError();
        reject(code);
      } else {
        resolve();
      }
    }),
  );
}

export async function installDeps(projectPath: string) {
  messages.depsInstall();
  const commandArgs = ["i"];
  await new Promise<void>((resolve, reject) =>
    spawn("pnpm", commandArgs, {
      cwd: projectPath,
      stdio: "inherit",
    }).on("close", (code: number) => {
      if (code !== 0) {
        messages.depsInstallError();
        reject(code);
      } else {
        resolve();
      }
    }),
  );
}
