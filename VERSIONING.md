# Guía de Versionamiento - DiligentOS Field Leads

## 📋 Sistema de Versiones

Este proyecto utiliza **Versionamiento Semántico (SemVer)** con generación automática de versiones y changelog.

### Formato de Versión: `MAJOR.MINOR.PATCH`

- **MAJOR** (1.0.0): Cambios incompatibles con versiones anteriores
- **MINOR** (0.1.0): Nueva funcionalidad compatible con versiones anteriores
- **PATCH** (0.0.1): Correcciones de bugs compatibles

---

## 🎯 Conventional Commits

Todos los commits deben seguir el formato:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Tipos de Commit

| Tipo | Descripción | Incrementa |
|------|-------------|------------|
| `feat` | Nueva funcionalidad | MINOR |
| `fix` | Corrección de bug | PATCH |
| `perf` | Mejora de rendimiento | PATCH |
| `docs` | Documentación | - |
| `style` | Formato de código | - |
| `refactor` | Refactorización | - |
| `test` | Tests | - |
| `build` | Sistema de build | - |
| `ci` | CI/CD | - |
| `chore` | Mantenimiento | - |
| `revert` | Revertir cambios | - |

### Breaking Changes

Para cambios que rompen compatibilidad, añade `BREAKING CHANGE:` en el footer o `!` después del tipo:

```bash
feat!: cambiar estructura de API

BREAKING CHANGE: Los endpoints ahora requieren autenticación
```

---

## 📝 Ejemplos de Commits

### ✅ Buenos ejemplos:

```bash
feat(leads): agregar filtro por estado
fix(auth): corregir validación de sesión
docs(readme): actualizar instrucciones de instalación
perf(api): optimizar consultas de base de datos
refactor(components): simplificar lógica de Dashboard
```

### ❌ Malos ejemplos:

```bash
update stuff
fixed bug
WIP
cambios varios
```

---

## 🚀 Crear una Nueva Versión

### 1. Asegúrate de que todos los cambios estén commiteados

```bash
git status
```

### 2. Ejecuta el comando de release apropiado:

#### Patch (0.0.X) - Correcciones de bugs
```bash
npm run release
```

#### Minor (0.X.0) - Nueva funcionalidad
```bash
npm run release:minor
```

#### Major (X.0.0) - Cambios incompatibles
```bash
npm run release:major
```

#### Primera versión
```bash
npm run release:first
```

### 3. Sube los cambios y tags a GitHub

```bash
git push --follow-tags origin master
```

---

## 🔄 Flujo de Trabajo Completo

```bash
# 1. Hacer cambios en el código
# 2. Commit con formato conventional
git add .
git commit -m "feat(pipeline): agregar vista de kanban mejorada"

# 3. Más commits si es necesario...
git commit -m "fix(pipeline): corregir drag and drop"

# 4. Cuando estés listo para release
npm run release:minor

# 5. Subir a GitHub
git push --follow-tags origin master
```

---

## 📦 Lo que hace `npm run release`

1. ✅ Analiza todos los commits desde el último release
2. ✅ Determina el nuevo número de versión
3. ✅ Actualiza `package.json`
4. ✅ Genera/actualiza `CHANGELOG.md`
5. ✅ Crea un commit de release
6. ✅ Crea un tag de Git

---

## 🛡️ Validación Automática

**Husky** valida automáticamente tus commits:

- ✅ Si el formato es correcto → Commit exitoso
- ❌ Si el formato es incorrecto → Commit rechazado con error

### Ejemplo de error:

```
⧗   input: actualizar cosas
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
```

---

## 📚 Recursos

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Standard Version](https://github.com/conventional-changelog/standard-version)

---

## 🎓 Tips

1. **Commits pequeños y frecuentes**: Mejor muchos commits pequeños que uno grande
2. **Mensajes descriptivos**: El subject debe explicar QUÉ cambió, no CÓMO
3. **Scope opcional**: Usa scope para indicar el módulo afectado
4. **Body para detalles**: Usa el body para explicar el POR QUÉ del cambio
5. **Footer para breaking changes**: Siempre documenta cambios incompatibles

---

## ⚠️ Importante

- **NO** edites manualmente `CHANGELOG.md`
- **NO** edites manualmente la versión en `package.json`
- **NO** hagas commits sin seguir el formato conventional
- **SÍ** usa `npm run release` para crear versiones
