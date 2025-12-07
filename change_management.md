# Change Management Policy

## 1. Objective
To minimize the risk of disruption to production services caused by unauthorized or untested changes.

## 2. Scope
Applies to all application code, database schemas, infrastructure configurations (Docker, Nginx), and secret management.

## 3. Change Types
*   **Standard Change**: Low risk, pre-approved (e.g., content updates, minor dependency patches).
*   **Normal Change**: Requires testing and approval (e.g., new features, schema migrations).
*   **Emergency Change**: Required to fix P1 incidents. Approval can be retrospective (within 24h).

## 4. Workflows
### 4.1 Development
*   **Feature Branches**: All changes start in a feature branch: `feat/xyz` or `fix/abc`.
*   **Local Testing**: Developer must verify functionality and run unit tests.
*   **Commit Messages**: Must follow Conventional Commits (e.g., `feat: user login`, `fix: header alignment`).

### 4.2 Code Review
*   **Pull Request (PR)**: Required for merging to `main`.
*   **Reviewers**: Minimum 1 peer reviewer required.
*   **CI Checks**: Build and Lint must pass before merge.

### 4.3 Deployment
*   **Staging**: Deploy to Staging environment for UAT (User Acceptance Testing).
*   **Production**: Deployed only after Staging sign-off.
*   **Maintenance Window**: High-risk changes scheduled for off-peak hours (e.g., Sunday 02:00 AM).

## 5. Rollback Plan
*   Every change must have a defined rollback strategy (e.g., revert Git commit, restore DB backup).
*   If deployment fails or causes P1 issues, immediate rollback is triggered.
