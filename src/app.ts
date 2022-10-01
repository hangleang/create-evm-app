import path from "path";
import { createProject, initializeGit, installDeps } from "./actions";
import { promptAndGetConfig } from "./user_input";
import * as messages from "./messages";

(async function () {
  const promptResult = await promptAndGetConfig();
  if (promptResult === null) {
    return;
  }
  const {
    config: { projectName, contract, frontend, subgraph, install },
    projectPath,
  } = promptResult;

  messages.creatingApp();

  let createSuccess;
  try {
    createSuccess = await createProject({
      contract,
      frontend,
      subgraph,
      projectName,
      verbose: false,
      rootDir: path.resolve(__dirname, "../templates"),
      projectPath,
    });

    await initializeGit(projectPath);
  } catch (e) {
    console.error(e);
    createSuccess = false;
  }
  if (install) {
    await installDeps(projectPath);
  }

  if (createSuccess) {
    messages.setupSuccess(projectName, contract, frontend, install);
  } else {
    messages.setupFailed();
    return;
  }
})();
