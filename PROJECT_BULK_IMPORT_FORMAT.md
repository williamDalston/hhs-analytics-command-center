# Project Bulk Import Format

Paste all your projects, decisions, blockers, stakeholders, deadlines, status, priority, and requirements using this format.

## Format Structure

Use this exact format - copy and paste your data following the structure below:

```
## PROJECTS

### Project 1: [Project Name]
**Stakeholder:** [Name]
**Deadline:** YYYY-MM-DD (or leave blank)
**Status:** Planning | Data Modeling | Visualizing | Review | Done
**Priority:** Normal | High | Critical
**Requirements:** 
[Your requirements text here - can be multiple lines]

### Project 2: [Project Name]
**Stakeholder:** [Name]
**Deadline:** YYYY-MM-DD
**Status:** In Progress
**Priority:** High
**Requirements:** 
[Your requirements text]

---

## DECISIONS

### Decision: [Decision Title]
**Date:** YYYY-MM-DD (or leave blank for today)
**Status:** Active | Resolved | Mitigated
**Description:** 
[Description of the decision]

### Decision: [Another Decision]
**Date:** 2024-01-15
**Status:** Resolved
**Description:** 
[Description]

---

## BLOCKERS

### Blocker: [Blocker Title]
**Date:** YYYY-MM-DD (or leave blank for today)
**Status:** Active | Resolved | Mitigated
**Description:** 
[Description of the blocker]

### Blocker: [Another Blocker]
**Date:** 2024-01-20
**Status:** Active
**Description:** 
[Description]
```

## Example

```
## PROJECTS

### Project 1: ASPA Analytics Dashboard
**Stakeholder:** Lakshman / Venkata
**Deadline:** 2024-12-01
**Status:** In Progress
**Priority:** High
**Requirements:** 
HHS branded theme. Metrics: Impressions, Engagements, Click-through rates.
Need to include date slicer and filter by campaign type.

### Project 2: Jira Delivery Dashboard
**Stakeholder:** David Urer
**Deadline:** 2024-12-15
**Status:** Planning
**Priority:** Critical
**Requirements:** 
Throughput and cycle time views. Need to connect to Jira API.
Include sprint burndown charts.

### Project 3: Campaign Performance Report
**Stakeholder:** Sarah Johnson
**Deadline:** 2024-11-30
**Status:** Review
**Priority:** Normal
**Requirements:** 
Monthly campaign performance metrics with drill-through capabilities.

---

## DECISIONS

### Decision: Use HashRouter
**Date:** 2024-11-22
**Status:** Resolved
**Description:** 
Switched to HashRouter for GitHub Pages compatibility. This allows the app to work without server-side routing configuration.

### Decision: Data Refresh Schedule
**Date:** 2024-11-25
**Status:** Active
**Description:** 
Decided to refresh data daily at 2 AM EST. Need to confirm with stakeholders.

---

## BLOCKERS

### Blocker: Jira API Access
**Date:** 2024-11-20
**Status:** Active
**Description:** 
Waiting on IT approval for PAT token. Cannot proceed with Jira dashboard until access is granted.

### Blocker: Data Source Permissions
**Date:** 2024-11-18
**Status:** Resolved
**Description:** 
Resolved - received necessary permissions from data team.
```

## Quick Reference

- **Section Headers:** Use `## PROJECTS`, `## DECISIONS`, `## BLOCKERS`
- **Project Headers:** Use `### Project 1: [Name]` or `### Project: [Name]`
- **Decision/Blocker Headers:** Use `### Decision: [Title]` or `### Blocker: [Title]`
- **Fields:** Use `**Field Name:**` format (e.g., `**Stakeholder:**`, `**Deadline:**`)
- **Separators:** Use `---` to separate sections
- **Dates:** Use YYYY-MM-DD format (e.g., 2024-12-01) or leave blank
- **Status Values:**
  - Projects: `Planning`, `Data Modeling`, `Visualizing`, `Review`, `Done`, `In Progress`
  - Decisions/Blockers: `Active`, `Resolved`, `Mitigated`
- **Priority Values:** `Normal`, `High`, `Critical`
- **Multi-line text:** Requirements and descriptions can span multiple lines

## Tips

- You can paste this directly from Excel, Google Sheets, or any text editor
- Leave date fields blank to use today's date
- Requirements and descriptions can be as long as needed
- You can include as many projects, decisions, and blockers as you want
- The format is case-sensitive for section headers (`##`, `###`)

