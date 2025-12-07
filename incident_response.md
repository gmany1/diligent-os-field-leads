# Incident Response Plan

## 1. Incident Classification
Incidents are categorized by severity to determine urgency and response protocol.

| Level | Severity | Definition | Response Time (SLA) |
| :--- | :--- | :--- | :--- |
| **P1** | **Critical** | System down, data corruption, or active security breach. Business operations halted. | **15 Minutes** |
| **P2** | **High** | Core feature degradation (e.g., cannot create Leads), significant performance drop. Workaround difficult. | **2 Hours** |
| **P3** | **Medium** | Minor bug, cosmetic issue, or non-blocking error. Workaround available. | **24 Hours** |
| **P4** | **Low** | Feature request or minor annoyance. | **Next Sprint** |

## 2. Response Workflow
### Phase 1: Detection & Identification
*   Alert triggered via Monitoring System (Prometheus/Grafana).
*   User report received via Helpdesk.
*   **Action**: On-call engineer verifies and classifies the incident.

### Phase 2: Containment & Mitigation
*   **P1/P2**: Establish War Room.
*   Isolate affected components (e.g., stop Docker container, block IP).
*   Implement temporary fix to restore service.

### Phase 3: Resolution & Recovery
*   Apply permanent patch or configuration change.
*   Verify system integrity (run test suite).
*   Restore data from backups if necessary.

### Phase 4: Post-Mortem (RCAR)
*   **Required for**: All P1 and P2 incidents.
*   **Deliverable**: Root Cause Analysis Report (RCAR) within 48 hours.
*   **Content**: What happened, why it happened, timeline, and preventative actions (CAPA).

## 3. Communication Plan
*   **Internal**: Status updates every 30 mins for P1 via Slack/Teams channel `#ops-incidents`.
*   **External**: Notify stakeholders via Status Page if downtime exceeds 1 hour.
