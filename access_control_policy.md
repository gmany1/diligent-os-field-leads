# Access Control Policy

## 1. Principle of Least Privilege
Users and systems are granted the minimum level of access necessary to perform their job functions.

## 2. Role-Based Access Control (RBAC)
Definition of standard roles within the application:

| Role | Access Level | Description |
| :--- | :--- | :--- |
| **GUEST** | None | Unauthenticated users. Redirected to Login. |
| **FIELD_LEAD_REP**| Read/Write (Own Data) | Can create Leads, view own Leads, manage own Activities. No delete access. |
| **MANAGER** | Read/Write (Territory) | Can view/edit Leads within their territory/branch. View team performance. |
| **EXECUTIVE** | Read-Only (Global) + Export | View all data, Dashboards, Financials. Can perform CCPA Exports. |
| **IT_ADMIN** | System Admin | Full access to User Management, System Config, Logs, Hard Delete. |

## 3. Authentication & Authorization
*   **Authentication**: Enforced via NextAuth.js (Session/JWT).
*   **Passwords**: Encrypted using BCrypt. Minimum length 8 chars.
*   **Session Management**: HTTPOnly cookies, secure flag enabled in production.
*   **API Security**: All API routes strictly protected by middleware checking active Session + Role.

## 4. User Lifecycle Management
*   **Onboarding**: Account created by IT_ADMIN upon hiring.
*   **Job Change**: Role updated within 24 hours of role change.
*   **Offboarding**: Account disabled (Soft Delete) immediately upon termination (revocation of access).

## 5. Review Cycle
*   **Access Review**: Quarterly review of all accounts with elevated privileges (IT_ADMIN, EXECUTIVE).
