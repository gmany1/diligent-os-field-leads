# Audit Procedure

## 1. Routine Review
*   **Frequency**: Monthly.
*   **Responsible**: IT Manager / CISO.
*   **Scope**: Review `AuditLog` for:
    *   Failed login spikes (Brute force).
    *   Unexpected exporting of bulk data (`BULK_EXPORT` or repeated `CCPA_EXPORT`).
    *   Deletion events (`DELETE_HARD`).

## 2. Incident Response
If a breach is suspected:
1.  Query `AuditLog` for given time range.
2.  Filter by `userId` or `ipAddress`.
3.  Cross-reference with HTTP Access Logs (Pino/Nginx).
4.  Lock accounts involved.

## 3. CCPA Verification
To verify CCPA Compliance:
1.  Check `AuditLog` for `action = 'CCPA_DELETE_SOFT'` where `entityId` matches request.
2.  Verify `Lead` record shows `name = 'DELETED_USER'`.
