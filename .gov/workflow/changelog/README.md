# StratAtlas Release Changelog Ledger

This folder is the governed release-notes ledger for publishable desktop builds.

Rules:

- One file per shipped version.
- Filename format: `v<semver>.md`.
- The governed installer build refuses promotion if the next version does not already have a matching changelog entry here.
- The active release kit copies the matching entry into the kit as `CHANGELOG_CURRENT.md`.
- Historical release notes stay here even after artifacts move to `.product/build_target/Releases/Archive/`.
