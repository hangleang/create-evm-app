import { Contract, CreateProjectParams, Subgraph } from "./types";

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

// const runWs = "pnpm -r"; // npm -ws or pnpm -r
// const runW = "pnpm --filter"; // npm -w or pnpm --filter

function basePackage({ contract, frontend, subgraph, projectName }: PackageBuildParams): Entries {
  const hasFrontend = frontend !== "none";

  return {
    name: projectName,
    version: "1.0.0",
    license: "MIT",
    private: true,
    scripts: {
      commit: "git-cz",
      ...devScript(hasFrontend),
      ...devContractScript(contract),
      ...buildScript(hasFrontend),
      ...buildContractScript(contract),
      ...deployScript(contract),
      ...unitTestScripts(contract),
      ...buildSubgraphInitScript(subgraph),
      release: "pnpm build && release-it",
      prepack: "pnpm build",
      postinstall: `husky install`,
    },
    devDependencies: {
      "@commitlint/cli": "^17.0.1",
      "@commitlint/config-conventional": "^17.0.0",
      ...buildSubgraphDeps(subgraph),
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
        dev: `concurrently -k "pnpm dev:contract" "pnpm dev:frontend"`,
        "dev:frontend": `cd frontend && pnpm dev`,
      }
    : {
        dev: `pnpm dev:contract`,
      };

const devContractScript = (contract: Contract): Entries =>
  contract !== "none"
    ? {
        "dev:contract": `cd contract && pnpm dev`,
      }
    : {};

const buildScript = (hasFrontend: boolean): Entries =>
  hasFrontend
    ? {
        build: `pnpm build:contract && pnpm build:frontend`,
        "build:frontend": `cd frontend && pnpm build`,
      }
    : {
        build: `pnpm build:contract`,
      };

const buildContractScript = (contract: Contract): Entries =>
  contract !== "none"
    ? {
        "build:contract": `cd contract && pnpm build`,
      }
    : {};

const deployScript = (contract: Contract): Entries =>
  contract !== "none"
    ? {
        deploy: `cd contract && pnpm deploy`,
      }
    : {};

const unitTestScripts = (contract: Contract): Entries =>
  contract !== "none"
    ? {
        test: `cd contract && pnpm test`,
      }
    : {};

const _installScript = (contract: Contract, hasFrontend: boolean, hasSubgraph: boolean): Entries => {
  const install_cmd = (dir: string, exist: boolean): string =>
    exist ? `cd ${dir} && rm -rf .git && pnpm install --ignore-scripts && cd ..` : `echo no ${dir}`;

  return {
    postinstall: `husky install && ${install_cmd("contract", contract !== "none")} && ${install_cmd(
      "subgraph",
      hasSubgraph,
    )} && ${install_cmd("frontend", hasFrontend)}`,
  };
};

const buildSubgraphDeps = (subgraph: Subgraph): Entries => {
  return subgraph !== "none"
    ? {
        "@graphprotocol/graph-cli": "^0.35.0",
      }
    : {};
};

const buildSubgraphInitScript = (subgraph: Subgraph): Entries => {
  return subgraph !== "none"
    ? {
        "subgraph:init": "graph init --studio subgraph",
      }
    : {};
};
