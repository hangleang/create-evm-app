import { Contract, CreateProjectParams } from "./types";

type Entries = Record<string, unknown>;
type PackageBuildParams = Pick<CreateProjectParams, "contract" | "frontend" | "subgraph" | "projectName">;

export function buildPackageJson({ contract, frontend, subgraph, projectName }: PackageBuildParams): Entries {
  const result = basePackage({
    contract,
    frontend,
    subgraph,
    projectName,
  });
  return result;
}

// const runWs = "yarn workspaces foreach"; // npm -ws or pnpm -r
// const runW = "yarn --cwd"; // npm -w or pnpm --filter

function basePackage({ contract, frontend, subgraph, projectName }: PackageBuildParams): Entries {
  const hasFrontend = frontend !== "none";
  const hasSubgraph = subgraph !== "none";

  return {
    name: projectName,
    version: "1.0.0",
    license: "MIT",
    private: true,
    packageManager: "yarn@3.2.3",
    scripts: {
      commit: "git-cz",
      ...devScript(hasFrontend),
      ...devContractScript(contract),
      ...buildScript(hasFrontend),
      ...buildContractScript(contract),
      ...deployScript(contract),
      ...unitTestScripts(contract),
      release: "yarn build && release-it",
      prepack: "yarn build",
      ...installScript(contract, hasFrontend, hasSubgraph),
    },
    devDependencies: {
      "@commitlint/cli": "^17.0.1",
      "@commitlint/config-conventional": "^17.0.0",
      "@release-it/conventional-changelog": "^5.0.0",
      commitizen: "^4.2.5",
      concurrently: "^7.4.0",
      "cz-conventional-changelog": "^3.3.0",
      husky: "^8.0.1",
      "lint-staged": "^13.0.3",
      prettier: "^2.7.1",
      "release-it": "^15.0.0",
    },
  };
}

const devScript = (hasFrontend: boolean): Entries =>
  hasFrontend
    ? {
        dev: `concurrently --kill-others "yarn run dev:contract" "yarn run dev:frontend"`,
        "dev:frontend": `cd frontend && yarn run dev`,
      }
    : {
        dev: `yarn run dev:contract`,
      };

const devContractScript = (contract: Contract): Entries =>
  contract !== "none"
    ? {
        "dev:contract": `cd contract && yarn run dev`,
      }
    : {};

const buildScript = (hasFrontend: boolean): Entries =>
  hasFrontend
    ? {
        build: `yarn run build:contract && yarn run build:frontend`,
        "build:frontend": `cd frontend && yarn run build`,
      }
    : {
        build: `yarn run build:contract`,
      };

const buildContractScript = (contract: Contract): Entries =>
  contract !== "none"
    ? {
        "build:contract": `cd contract && yarn run build`,
      }
    : {};

const deployScript = (contract: Contract): Entries =>
  contract !== "none"
    ? {
        deploy: `cd contract && yarn run deploy`,
      }
    : {};

const unitTestScripts = (contract: Contract): Entries =>
  contract !== "none"
    ? {
        test: `cd contract && yarn run test`,
      }
    : {};

const installScript = (contract: Contract, hasFrontend: boolean, hasSubgraph: boolean): Entries => {
  const install_cmd = (dir: string, exist: boolean): string =>
    exist ? `cd ${dir} && rm -rf .git && yarn install --ignore-scripts && cd ..` : `echo no ${dir}`;

  return {
    postinstall: `husky install && ${install_cmd("contract", contract !== "none")} && ${install_cmd(
      "subgraph",
      hasSubgraph,
    )} && ${install_cmd("frontend", hasFrontend)}`,
  };
};
