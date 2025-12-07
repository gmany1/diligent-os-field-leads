# Privacy Internal Procedure

## 1. Data Classification (PII)
The following fields are considered PII (Personally Identifiable Information) and must be handled with strict confidentiality:

*   **Lead**: `name`, `phone`, `email`, `notes`
*   **Activity**: `notes`
*   **Quote**: `pdfUrl` (may contain user details)
*   **User**: `name`, `email`, `territory`

## 2. Access Control
Access to `CCPA` endpoints is strictly limited to:
*   **EXECUTIVE**
*   **IT_ADMIN**

RBAC is enforced via Middleware and API Logic. Unauthorized attempts are logged to `AuditLog`.

## 3. Encryption
*   **At Rest**: `pgcrypto` extension enabled.
*   **In Transit**: HTTPS (TLS 1.2+).
*   **Application Level**: Sensitive notes should be minimized.

## 4. Audit Trail
All CCPA actions (`EXPORT`, `DELETE_SOFT`, `DELETE_HARD`) are logged in the `AuditLog` table with:
*   `userId`: Who performed the action.
*   `entityId`: The Lead ID affected.
*   `timestamp`: When it happened.
*   `ipAddress`: Origin IP.

## 5. Right to Know (Export)
*   **Endpoint**: `GET /api/privacy/export?leadId={id}`
*   Returns full JSON dump of Lead + Activities + Quotes + Commissions.

## 6. Right to Delete
*   **Endpoint**: `POST /api/privacy/delete`
*   **Soft Delete (Default)**: Anonymizes PII fields to `NULL` or `ANONYMIZED`. Preserves statistical record.
*   **Hard Delete**: Permanently removes all records. Reserved for severe legal requirements.
