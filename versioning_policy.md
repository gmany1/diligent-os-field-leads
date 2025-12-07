# Versioning Policy

## 1. Semantic Versioning
This project follows [Semantic Versioning 2.0.0](https://semver.org/).

Format: `MAJOR.MINOR.PATCH`

*   **MAJOR** version when you make incompatible API changes.
*   **MINOR** version when you add functionality in a backward compatible manner.
*   **PATCH** version when you make backward compatible bug fixes.

## 2. Release Tagging
*   Git Tags are used to mark releases: `v1.0.0`, `v1.1.0`.
*   Production deployments must be built from a tagged commit.

## 3. Changelog
*   A `CHANGELOG.md` file is maintained in the root directory.
*   All significant changes are recorded under the version header.
*   Structure:
    *   `[Version] - Date`
    *   `Added`
    *   `Changed`
    *   `Deprecated`
    *   `Removed`
    *   `Fixed`
    *   `Security`

## 4. Database Versioning
*   Database schema changes are managed via Prisma Migrations.
*   Migration files are versioned and committed to source control.
*   Schema changes must be backward compatible whenever possible to allow zero-downtime deployments.
