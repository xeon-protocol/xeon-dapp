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

`chore:` a code change that neither fixes a bug nor adds a feature

`docs:` documentation only changes

`feat:` a new feature

`fix:` a bug fix

`perf:` a code change that improves performance

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
