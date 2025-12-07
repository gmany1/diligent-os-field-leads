# 🚀 Quick Reference - Versionamiento

## Comandos Rápidos

### Crear Commits
```bash
# Formato: <type>(<scope>): <subject>

git commit -m "feat(leads): agregar búsqueda avanzada"
git commit -m "fix(auth): corregir timeout de sesión"
git commit -m "docs(api): actualizar documentación de endpoints"
```

### Crear Releases
```bash
# Patch (0.0.X) - Bugs fixes
npm run release

# Minor (0.X.0) - New features
npm run release:minor

# Major (X.0.0) - Breaking changes
npm run release:major

# Primera versión
npm run release:first
```

### Publicar
```bash
git push --follow-tags origin master
```

---

## Tipos de Commit

| Tipo | Emoji | Cuándo usar |
|------|-------|-------------|
| `feat` | ✨ | Nueva funcionalidad |
| `fix` | 🐛 | Corrección de bug |
| `perf` | ⚡ | Mejora de rendimiento |
| `docs` | 📚 | Documentación |
| `style` | 💎 | Formato (sin cambios de lógica) |
| `refactor` | ♻️ | Refactorización |
| `test` | ✅ | Tests |
| `build` | 🏗️ | Build system |
| `ci` | 👷 | CI/CD |
| `chore` | 🔧 | Mantenimiento |

---

## Ejemplos por Módulo

### Leads
```bash
git commit -m "feat(leads): agregar exportación a Excel"
git commit -m "fix(leads): corregir filtro por fecha"
```

### Pipeline
```bash
git commit -m "feat(pipeline): implementar drag and drop"
git commit -m "fix(pipeline): corregir actualización de estado"
```

### Auth
```bash
git commit -m "feat(auth): agregar autenticación de dos factores"
git commit -m "fix(auth): corregir validación de tokens"
```

### API
```bash
git commit -m "feat(api): agregar endpoint de reportes"
git commit -m "perf(api): optimizar consultas de leads"
```

### UI/Components
```bash
git commit -m "feat(ui): agregar tema oscuro"
git commit -m "style(components): mejorar responsive design"
```

---

## Breaking Changes

```bash
# Opción 1: Con !
git commit -m "feat(api)!: cambiar estructura de respuesta"

# Opción 2: Con footer
git commit -m "feat(api): cambiar estructura de respuesta

BREAKING CHANGE: Los endpoints ahora retornan { data, meta } en lugar de solo data"
```

---

## Flujo Completo

```bash
# 1. Trabajar en feature
git checkout -b feature/nueva-funcionalidad

# 2. Commits convencionales
git add .
git commit -m "feat(module): descripción del cambio"

# 3. Merge a master
git checkout master
git merge feature/nueva-funcionalidad

# 4. Crear release
npm run release:minor

# 5. Publicar
git push --follow-tags origin master
```

---

## Verificar antes de Release

```bash
# Ver commits desde último tag
git log $(git describe --tags --abbrev=0)..HEAD --oneline

# Ver cambios pendientes
git status

# Ver qué versión se generará
npm run release -- --dry-run
```

---

## Troubleshooting

### Commit rechazado
```
✖   subject may not be empty [subject-empty]
```
**Solución**: Usa el formato correcto: `type(scope): subject`

### No se puede hacer release
```
Error: No commits since last release
```
**Solución**: Necesitas al menos un commit desde el último release

### Conflicto en CHANGELOG
**Solución**: NO edites CHANGELOG.md manualmente, déjalo a standard-version

---

## 📖 Documentación Completa

Ver `VERSIONING.md` para la guía completa.
