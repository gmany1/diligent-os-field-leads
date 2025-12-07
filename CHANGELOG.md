# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.1.0 (2025-12-07)


### ⏪ Reverts

* Include dev.db for demo purposes ([57a62ed](https://github.com/gmany1/diligent-os-field-leads/commit/57a62ed66d82f74287bfbc26276fca0201e07e88))


### ♻️ Code Refactoring

* Simplify Prisma client initialization to standard pattern ([a8414f6](https://github.com/gmany1/diligent-os-field-leads/commit/a8414f6d2414a342a0b64ace9a0c32882191d9f9))


### 📚 Documentation

* add docker deployment instructions to DEPLOYMENT.md ([993dac6](https://github.com/gmany1/diligent-os-field-leads/commit/993dac6e1874b4f6615c72c3a7ae192b13e2a2f3))


### 🔧 Chores

* add architecture check to entrypoint debug info ([e17e774](https://github.com/gmany1/diligent-os-field-leads/commit/e17e77457b0e249c79faca81cbdace5dacf3fd39))
* add db:setup script and fix prisma scripts ([28d166c](https://github.com/gmany1/diligent-os-field-leads/commit/28d166c2e2f89e490232227ad879a722d56c1339))
* add detailed auth debug logs ([31e4128](https://github.com/gmany1/diligent-os-field-leads/commit/31e412858ec5827d5126a66e477ac8bff905880a))
* remove debug logs ([2a15c5b](https://github.com/gmany1/diligent-os-field-leads/commit/2a15c5b6f9acdd213e8c6a8e0a1f934e9f8bb79d))


### 🐛 Bug Fixes

* Add nixpacks.toml to override build command ([daac321](https://github.com/gmany1/diligent-os-field-leads/commit/daac3219a7fffae65163873639aa383ec3b78d07))
* Add tailwind.config.js for explicit content path configuration ([5e9075c](https://github.com/gmany1/diligent-os-field-leads/commit/5e9075c8aff7e278a56aba2197af2d742b906559))
* Configure PostCSS to use @tailwindcss/postcss for Tailwind v4 ([a89d2a8](https://github.com/gmany1/diligent-os-field-leads/commit/a89d2a8b84983cf191162552d803e82be1fdfc3f))
* copy prisma schema to runner stage in Dockerfile ([0a9568f](https://github.com/gmany1/diligent-os-field-leads/commit/0a9568fdd286b56fb390ed4ee2a57b02eead0a95))
* copy seed.js and set HOME for npx ([6ed3271](https://github.com/gmany1/diligent-os-field-leads/commit/6ed32714d0c32ab8deb679aeb7b38d70ce2dd71c))
* Enable trustHost explicitly and improve auth error logging ([daa048b](https://github.com/gmany1/diligent-os-field-leads/commit/daa048b39788ed53930b7aa2589568979a368726))
* explicit cookie config to solve session loss ([bc42f6f](https://github.com/gmany1/diligent-os-field-leads/commit/bc42f6fc7e665eb5d485a1a969bfa5c499b5f182))
* Explicitly set session strategy to jwt in auth.ts ([ae2d65c](https://github.com/gmany1/diligent-os-field-leads/commit/ae2d65c391891062efb2f372a61d6252c6cce5ce))
* Force delete and recreate users in reset route to ensure password update ([3248194](https://github.com/gmany1/diligent-os-field-leads/commit/3248194c15199ce5dd5cf0a4cc397151a8eaf4c8))
* Force new PrismaClient instance in auth to avoid stale connection ([b22c40e](https://github.com/gmany1/diligent-os-field-leads/commit/b22c40ebd8d51dd6cc3bcfa1dac84deaafd79c34))
* force password update in seed and add auth logs ([4111227](https://github.com/gmany1/diligent-os-field-leads/commit/41112272ed6640b20fb0ed48d101268c657de0b9))
* full node_modules and local prisma ([79d7aba](https://github.com/gmany1/diligent-os-field-leads/commit/79d7aba78db2f381a25fcf32bdcbb385ec107f01))
* Implement master bypass for login to resolve SQLite split-brain issue ([d7ae99d](https://github.com/gmany1/diligent-os-field-leads/commit/d7ae99d407ba0ccc842188e7635d63aee03b105a))
* Install @tailwindcss/cli to satisfy deployment build command ([35729b5](https://github.com/gmany1/diligent-os-field-leads/commit/35729b538b16f0478e34cdd9f95b75452a8040d2))
* move prisma to deps and run migrations in entrypoint ([ac862c9](https://github.com/gmany1/diligent-os-field-leads/commit/ac862c949ea49d179c2230d5cbcbaadddcc6277f))
* move redirect logic to client side to preserve cookies ([381b6e1](https://github.com/gmany1/diligent-os-field-leads/commit/381b6e16d212c354bae6798babfe6522c121f766))
* Remove debug color and add explicit [@source](https://github.com/source) to globals.css ([8ae9d95](https://github.com/gmany1/diligent-os-field-leads/commit/8ae9d95f2efd137f2d3237933a1f6d098f4e58da))
* revert custom cookie config, simplified auth setup ([964f2cf](https://github.com/gmany1/diligent-os-field-leads/commit/964f2cf126ad1b6d81681e862973cea0596fac52))
* revert explicit cookie config, session is working ([71b7abd](https://github.com/gmany1/diligent-os-field-leads/commit/71b7abd171fe143f2d3370c26fa6b813d30400d1))
* Revert manual secure cookie setting to restore local dev functionality ([11ea2e9](https://github.com/gmany1/diligent-os-field-leads/commit/11ea2e92d73db21f8597662e66cf9f6d0270c8b1))
* run prisma generate in entrypoint ([f5c2a77](https://github.com/gmany1/diligent-os-field-leads/commit/f5c2a7782f939ae060cd0cd850690eed5b77abb7))
* Stop tracking database file and update gitignore ([0a813d9](https://github.com/gmany1/diligent-os-field-leads/commit/0a813d90f3f5e73e82eefae52219b32f3634d793))
* update dockerfile to node:20-slim and upgrade prisma to 6.1.0 for openssl compatibility ([5d2b03a](https://github.com/gmany1/diligent-os-field-leads/commit/5d2b03a7d37899bd01d0c6f42b22a1b7a67bb4dd))
* Update globals.css to use Tailwind v4 syntax ([f6e0e94](https://github.com/gmany1/diligent-os-field-leads/commit/f6e0e94641a7748504be9882e8d2d956788acfcb))
* Use @tailwindcss/postcss for Tailwind v4 compatibility ([7157009](https://github.com/gmany1/diligent-os-field-leads/commit/7157009f0f709cbd12bbecc4cadd2a21931eda2b))
* Use DATABASE_URL env var in prisma schema instead of hardcoded path ([20befbe](https://github.com/gmany1/diligent-os-field-leads/commit/20befbef8187d4a7b6bb770e3c8f3685c6ada1f1))
* use direct prisma binary and auto-seed ([5f6f617](https://github.com/gmany1/diligent-os-field-leads/commit/5f6f61764f3c725e54ec2294a527166f0558ca29))
* use local prisma bin and add password to seed ([14c82d0](https://github.com/gmany1/diligent-os-field-leads/commit/14c82d0ecdc2ed8a25c17bc7902b304e46364dea))


### ✨ Features

* Add admin reset route to restore default users ([5e20d90](https://github.com/gmany1/diligent-os-field-leads/commit/5e20d9011cc110dc8b560ce6c7eee0105926336b))
* add secure cookie configuration ([ec588d7](https://github.com/gmany1/diligent-os-field-leads/commit/ec588d702bea81076b60865be4dafe9bacad5080))
* Add user registration page and functionality ([8ee02e3](https://github.com/gmany1/diligent-os-field-leads/commit/8ee02e3b7bb97a1ddc4e8f72330b260b0e6f9ef7))
* complete RBAC implementation with multi-branch support, audit logging, CCPA compliance, and SQLite migration ([99bc89b](https://github.com/gmany1/diligent-os-field-leads/commit/99bc89b6bcce8fea2504c453d218a4a1519dbcbb))
* switch database provider to postgresql ([c107b35](https://github.com/gmany1/diligent-os-field-leads/commit/c107b35ac0bc35902404708d57bc80a3141e5838))


### 🏗️ Build System

* implement automated versioning system with conventional commits ([22064db](https://github.com/gmany1/diligent-os-field-leads/commit/22064db5ed55b7fe152d4bf4e86a60fdff216ec1))

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
