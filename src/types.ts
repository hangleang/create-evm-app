export type Contract = "hardhat" | "foundry" | "none";
export const CONTRACTS: Contract[] = ["hardhat", "foundry", "none"];
export type Frontend = "nextjs" | "vite" | "none";
export const FRONTENDS: Frontend[] = ["nextjs", "vite", "none"];
export type Subgraph = "the-graph" | "none";
export const SUBGRAPHS: Subgraph[] = ["the-graph", "none"];
export type StandardContracts = "openzeppelin" | "solmate" | "none";
export const STD_CONTRACTS: StandardContracts[] = ["openzeppelin", "solmate", "none"];
export type ProjectName = string;
export interface UserConfig {
  contract: Contract;
  frontend: Frontend;
  subgraph: Subgraph;
  // TODO: add standard contracts, package managers
  projectName: ProjectName;
  install: boolean;
}
export type CreateProjectParams = {
  contract: Contract;
  frontend: Frontend;
  subgraph: Subgraph;
  // TODO: add standard contracts, package managers
  projectPath: string;
  projectName: ProjectName;
  verbose: boolean;
  rootDir: string;
};
