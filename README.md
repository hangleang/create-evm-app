# Create EVM App

===============
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/hangleang/create-evm-app)

Quickly build apps backed by the EVM-based blockchain

## Prerequisites

Make sure you have a [current version of Node.js](https://nodejs.org/en/about/releases/) installed – we are targeting versions `16+`.

Read about other [prerequisites](https://ethereum.org/en/developers/docs/evm/) in our docs.

## Dev Testing

To test the tool on the local dev:

    pnpm install && pnpm start

To install the tool globally on the local dev:

    npm i -g

Then, the `create-evm-app` binary will available with `npx` command.

## Getting Started

To create a new EVM fullstack dapp run this and follow interactive prompts:

    npx create-evm-app

Follow the instructions in the README.md in the project you just created! 🚀

You can create contracts written in Solidity with:

- [Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started#quick-start)
- [Foundry](https://book.getfoundry.sh/)

You can create a frontend template with:

- [NextJS](https://nextjs.org/docs/getting-started)
- Vite
<!-- - [NuxtJS](https://nuxtjs.org/docs/get-started/installation) -->

### Using CLI arguments to run `create-evm-app`

This CLI supports arguments to skip interactive prompts:

```shell
npx create-evm-app
  <project-name>
  --contract hardhat|foundry|none
  --frontend nextjs|vite|none
  --subgraph the-graph|none
  --install
```

Use `--install` to automatically install dependencies from all `package.json` files.

When using arguments, all arguments are required, except for `--install`.

## Getting Help

Check out our [documentation](https://docs.near.org) or chat with us on [Discord](http://near.chat). We'd love to hear from you!

## Contributing to `create-evm-app`

To make changes to `create-evm-app` itself:

- clone the repository
- in your terminal, enter one of the folders inside `templates`, such as `templates/contracts/hardhat`
- now you can run `npm install` to install dependencies and `npm run dev` to run the local development server, just like you can in a new app created with `create-evm-app`

#### About commit messages

`create-evm-app` uses semantic versioning and auto-generates nice release notes & a changelog all based off of the commits. We do this by enforcing [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). In general the pattern mostly looks like this:

    type(scope?): subject  #scope is optional; multiple scopes are supported (current delimiter options: "/", "\" and ",")

Real world examples can look like this:

    chore: run tests with GitHub Actions

    fix(server): send cors headers

    feat(blog): add comment section

If your change should show up in release notes as a feature, use `feat:`. If it should show up as a fix, use `fix:`. Otherwise, you probably want `refactor:` or `chore:`. [More info](https://github.com/conventional-changelog/commitlint/#what-is-commitlint)

#### Deploy `create-evm-app`

If you want to deploy a new version, you will need two prerequisites:

1. Get publish-access to [the NPM package](https://www.npmjs.com/package/near-api-js)
2. Get write-access to [the GitHub repository](https://github.com/near/near-api-js)
3. Obtain a [personal access token](https://gitlab.com/profile/personal_access_tokens) (it only needs the "repo" scope).
4. Make sure the token is [available as an environment variable](https://github.com/release-it/release-it/blob/master/docs/environment-variables.md) called `GITHUB_TOKEN`

Then run one script:

    pnpm release

Or just `release-it`

## License

This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).
See [LICENSE](LICENSE) and [LICENSE-APACHE](LICENSE-APACHE) for details.
