# Contributing

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-darkgreen.svg)](https://github.com/xeon-protocol/xeon-dapp/blob/main/CONTRIBUTING.md) [![Bug Bounties](https://img.shields.io/badge/Bug_Bounties-open-darkgreen.svg)](https://github.com/xeon-protocol/xeon-dapp/blob/main/SECURITY.md)

Feel free to dive in! [Open](https://github.com/xeon-protocol/xeon-dapp/issues/new) an issue, [start](https://github.com/xeon-protocol/xeon-dapp/discussions/new) a discussion or submit a PR. For any informal concerns or feedback, please join our [Telegram Group](https://t.me/XeonProtocolPortal).

Contributions to Xeon Protocol are welcome by anyone interested in writing tests, improving readability, optimizing the build, or extending the protocol via new features.

## Pre Requisites

You will need the following software on your machine:

[![git](https://img.shields.io/badge/git-any-darkgreen)](https://git-scm.com/downloads) [![node](https://img.shields.io/badge/node.js->_14.2.4-darkgreen)](https://nodejs.org/en/download/) [![npm](https://img.shields.io/badge/npm->=_6-darkgreen)](https://npmjs.com/)

In addition, familiarity with [Solidity](https://soliditylang.org/) and contract ABIs is a plus but not required for frontend contribution.

## Getting Started

### 1. Fork the Repository

First, create a fork of this repository to your GitHub account. You can do this by visiting the repository page and clicking the "Fork" button in the top right corner.

[Visit the Repository](https://github.com/xeon-protocol/xeon-dapp)

### 2. Clone Your Fork Locally

Once you have forked the repository, clone your fork to your local machine:

```shell
git clone https://github.com/<your-username>/xeon-dapp.git
```

### 3. Set Up the Original Repository as a Remote

To keep your fork up-to-date with the original repository, add the original repository as a remote:

```shell
cd xeon-dapp
git remote add upstream https://github.com/xeon-protocol/xeon-dapp.git
```

## Environment variables

### Local Setup

To build locally, copy the `.env.sample` file to a new `.env` file at the root of the repo and populate it with the appropriate environment values.

⚠️ **NOTE:** Only put sensitive data in the `.env` file, which `.gitignore` will automatically ignore. **DO NOT** save sensitive data in `.env.sample`.

## Pull Requests

All work should be done on it's own branch. Once you are done working on a branch, create a pull request to merge it back into `main`.

When making a pull request, ensure that:

- All tests pass.
  - Fork testing requires environment variables to be set up in the forked repo.
- Code coverage remains the same or greater.
- All new code adheres to the style guide:
  - All lint checks pass
  - Code is thoroughly commented with NatSpec where relevant.
- If making a change to the contracts:
  - Gas snapshots are provided and demonstrate an improvement (or an acceptable deficit given other improvements).
  - Reference contracts are modified correspondingly if relevant.
  - New tests are included for all new features or code paths.
- A descriptive summary of the PR has been provided.
- Assign reviewers to the PR and request a **code review**.
- Address any feedback or requested changes promptly.

## Additional Guidelines

In order to maintain high quality code that is easy to collaborate on, please make sure to stick to best practices. Expectations for code management are listed below.

## Branching Strategy

- Always create a new branch from `main` for any new feature or bug fix.
- To avoid merge conflicts, each branch should only serve a single purpose.
- Use descriptive branch names that clearly indicate the purpose of the branch, such as:

```shell
`ui/integrate-ui-kit`
`feature/update-hedging-contracts`
`bugfix/fix-login-issue`
```

## Code Reviews

- Reviewers should provide constructive feedback and look for potential issues or improvements.
- Make sure to test the changes locally before approving the PR.
- Only approve PRs that meet our quality standards and follow our coding guidelines.

## Merging

- Once the PR is approved and all checks pass, squash and merge into `main`.
  - Use **squash and merge** to keep the commit history clean (unless the branch contains logically distinct commits that should be preserved).

## Maintaining a Clean Codebase

- Regularly pull the latest changes from `main` into your working branches to avoid conflicts.
- After merging a branch, delete it to keep the repo clean.
- Document any significant changes or new features in our project documentation (`README.md` and associated files).

## Additional Guidelines

- **Commit Messages:** Write clear and concise commit messages that accurately describe the changes made. Use the imperative mood and present tense (e.g., `"Fix bug in user authentication"`).
- **Coding Standards:** Follow our coding standards and style guides to ensure consistency across the codebase. Refer to the project's documentation for specific guidelines.
- **Testing:** Write and maintain unit and integration tests for all new features and bug fixes. Ensure that all tests pass before submitting a pull request.
- **Documentation:** Keep the documentation up-to-date with any code changes. This includes comments within the code, as well as external documentation like the `README.md` and any additional guides.

## Commit Guidelines

We use conventional commits in our codebases, more information [here](commit-guidelines.md)

## Notice

These guidelines apply to all code in the Xeon Protocol codebase and this `CONTRIBUTING.md` file should accompany every repository in the organization.
