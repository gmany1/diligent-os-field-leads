# Data Map

## Entity: Lead
| Field | Type | Classification | Storage |
|-------|------|----------------|---------|
| id | CUID | Public ID | Plaintext |
| name | String | **PII (High)** | Plaintext (DB) |
| phone | String | **PII (High)** | Plaintext (DB) |
| email | String | **PII (High)** | Plaintext (DB) |
| address | String | PII (Medium) | Plaintext |
| notes | Text | PII (Medium) | Plaintext |
| stage | String | Internal | Plaintext |

## Entity: User
| Field | Type | Classification | Storage |
|-------|------|----------------|---------|
| email | String | **PII (High)** | Plaintext (Unique) |
| password | String | **Secret** | BCrypt Hash |
| role | Enum | Internal | Plaintext |

## Entity: AuditLog
| Field | Type | Classification | Storage |
|-------|------|----------------|---------|
| userId | String | Internal | Plaintext |
| ipAddress| String | PII (Low) | Plaintext |
| details | JSON | Confidential | Plaintext |
