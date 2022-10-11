import { CreateProjectParams } from "./types";
import YAML from "yaml";

type Entries = Record<string, unknown>;
type WorkspaceParams = Pick<CreateProjectParams, "contract" | "frontend" | "subgraph">;

export function buildWorkspace({ contract, frontend, subgraph }: WorkspaceParams): string {
  const hasContract = contract !== "none";
  const hasFrontend = frontend !== "none";
  const hasSubgraph = subgraph !== "none";

  const packages: string[] = [];
  if (hasContract) {
    packages.push("contract");
  }
  if (hasFrontend) {
    packages.push("frontend");
  }
  if (hasSubgraph) {
    packages.push("subgraph");
  }
  const entities: Entries = {
    packages,
  };

  const doc = new YAML.Document(entities);
  return doc.toString();
}
