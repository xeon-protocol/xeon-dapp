# Contributing Guidelines

In order to maintain high quality code that is easy to collaborate on, please make sure to stick to best practices. Expectations for code management are listed below. These guidelines apply to all code in the Xeon Protocol codebase and this `CONTRIBUTING.md` file should accompany every repository in the organization.

## Branching Strategy

- Always create a new branch from `main` for any new feature or bug fix.
- Use descriptive branch names that clearly indicate the purpose of the branch, such as:
  - `feature/integrate-figma-ui-kit`
  - `bugfix/fix-login-issue`
  - `test/hedging-unit-tests`\
- To avoid merge conflicts, each branch should only serve a single purpose.

## Pull Requests (PRs)

- Once you are done working on a branch, create a pull request to merge it back into `main`.
- Provide a clear and detailed description of the changes made in the PR.
- Assign reviewers to the PR and request a **code review**.
- Address any feedback or requested changes promptly.

## Code Reviews

- Reviewers should provide constructive feedback and look for potential issues or improvements.
- Make sure to test the changes locally before approving the PR.
- Only approve PRs that meet our quality standards and follow our coding guidelines.

## Merging

- Once the PR is approved and all checks pass, merge the branch into `main`.
- Use **squash and merge** to keep the commit history clean (unless the branch contains logically distinct commits that should be preserved).

## Maintaining a Clean Codebase

- Regularly pull the latest changes from `main` into your working branches to avoid conflicts.
- After merging a branch, delete it to keep the repo clean.
- Document any significant changes or new features in our project documentation (`README.md` and associated files).

Adhering to these will keep things running smoothly, reduce the risk of conflicts, and help maintain high-quality and clean code.

## Additional Guidelines

- **Commit Messages:** Write clear and concise commit messages that accurately describe the changes made. Use the imperative mood and present tense (e.g., `"Fix bug in user authentication"`).
- **Coding Standards:** Follow our coding standards and style guides to ensure consistency across the codebase. Refer to the project's documentation for specific guidelines.
- **Testing:** Write and maintain unit and integration tests for all new features and bug fixes. Ensure that all tests pass before submitting a pull request.
- **Documentation:** Keep the documentation up-to-date with any code changes. This includes comments within the code, as well as external documentation like the `README.md` and any additional guides.

---

# Commit Guidelines

Xeon Protocol uses **The Conventional Commits** specification across the codebase. Refer to the complete [documentation](https://www.conventionalcommits.org/en/v1.0.0/#summary) for details.

Commit messages should be structured as follows:

```
<type>(optional scope): <description>

[optional body]

[optional footer(s)]
```

This commit structure communicates intent to consumers of the codebase, and automatically populates our CHANGELOG which helps with version control, and ensures that we can easily trace the commit history.

## Type

Main commit types are `fix` for bug patches and `feat` for new features. Other types are allowed, but must be one of the following:

`build:` a change that affect the build system or external dependencies (example scopes: `scripts`, `foundry`, `npm`, `docker`)

`docs:` documentation only changes

`feat:` a new feature

`fix:` a bug fix

`perf:` a code change that improves performance

`refactor:` a code change that neither fixes a bug nor adds a feature

`style:` a change that does not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)

`test:` adding missing tests or correcting existing tests

## Scope

Optional field that is only relevant if changes are made in a repository that has multiple packages.

## Description

A succinct description of the change:

- use the imperative, present tense: _"change"_ not _"changed"_ nor _"changes"_
- don't capitalize the first letter
- no dot (.) at the end

## Body

Just as in the subject, use the imperative, present tense: **_"change"_** not _"changed"_ nor _"changes"_. The body should include the motivation for the change and contrast this with previous behavior.

## Footer

The footer contains any info about **Breaking Changes** and is the place to reference any GitHub issues that the commit **CLOSES**.

- `BREAKING CHANGE:` footer or appends a `!` after the type/scope introduces a breaking change. This correlates to a new `MAJOR` version and can be associated with any type.

## Example Commits

Commit message with no body

```
docs: add commit guidelines to CHANGELOG
```

Commit message with multi-paragraph body and multiple footers

```
feat(wallet): multi-chain balance display

Introduce a multi-chain native wallet modal to display total user balance across networks. Dismiss dust.

Remove obsolete dependencies for multiple networks.

Reviewed-by: Jon
Refs: #123
```

If a commit fixes a specific issue, indicate the number after the description.

```
fix: resolve network not switching (#69)
```

---

By following these guidelines, we can ensure a collaborative and efficient workflow, maintain a high standard of code quality, and create a better product for our users.

Thank you for your contributions!
