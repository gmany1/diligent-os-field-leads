# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [Unreleased]

### ✨ Features

- **RBAC**: Complete Role-Based Access Control implementation with multi-branch support
  - Granular roles: CEO, BRANCH_MANAGER, SALES_REP, IT_SUPER_ADMIN
  - Branch-level permissions and data isolation
  - Authorization middleware for all API endpoints

- **Audit Logging**: Comprehensive audit trail system
  - Centralized `logAudit` helper function
  - Automatic logging of all critical actions
  - IP address and user-agent tracking

- **CCPA Compliance**: Full California Consumer Privacy Act compliance
  - Data retention policies
  - Incident response plan
  - Compliance verification scripts
  - Complete documentation

- **Database**: Migration from PostgreSQL to SQLite
  - Simplified development setup
  - Realistic seed data
  - Updated schema with branches and enhanced roles

- **Testing**: Test infrastructure setup
  - Vitest configuration
  - Server action tests
  - Enhanced logger with structured logging

### 🐛 Bug Fixes

- **API**: Fixed executive reports endpoint SQL compatibility
- **Charts**: Resolved Recharts dimension warnings
- **Auth**: Fixed session persistence issues

### 📚 Documentation

- Implementation plan for all features
- Incident response procedures
- Data retention policies
- CCPA compliance documentation

### 🏗️ Build System

- Updated dependencies to latest versions
- Configured Husky for git hooks
- Added commitlint for conventional commits
- Integrated standard-version for automated releases

---

**Note**: This changelog will be automatically updated with each release using `npm run release`.
