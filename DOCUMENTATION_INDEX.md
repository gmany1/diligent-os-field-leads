# 📚 Índice de Documentación - DiligentOS Field Leads

**Versión:** v0.1.0  
**Última actualización:** 2025-12-06

---

## 🎯 Documentación Principal

### 1. **[README.md](README.md)** - Inicio Rápido
- Descripción general del proyecto
- Instalación y configuración
- Comandos disponibles
- Estructura del proyecto
- Troubleshooting básico

### 2. **[VERSIONING.md](VERSIONING.md)** - Sistema de Versionamiento ⭐ NUEVO
- Guía completa de Semantic Versioning
- Conventional Commits explicados
- Cómo crear releases
- Ejemplos y mejores prácticas
- **LECTURA OBLIGATORIA** para contribuidores

### 3. **[CHANGELOG.md](CHANGELOG.md)** - Historial de Cambios
- Registro automático de todos los cambios
- Organizado por versiones
- Generado automáticamente con cada release
- **NO EDITAR MANUALMENTE**

---

## 🚀 Guías de Desarrollo

### 4. **[.github/COMMIT_CONVENTION.md](.github/COMMIT_CONVENTION.md)** - Referencia Rápida
- Comandos rápidos para commits
- Ejemplos por módulo
- Tipos de commit con emojis
- Flujo de trabajo completo
- **CONSULTA RÁPIDA** para el día a día

### 5. **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - Plan de Implementación
- Roadmap del proyecto
- Fases de desarrollo
- Features planificadas vs implementadas
- Arquitectura técnica

---

## 🏗️ Deployment y Operaciones

### 6. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guía de Despliegue
- Instrucciones para Docker
- Configuración de producción
- Variables de entorno
- Troubleshooting de deployment

### 7. **[FIXES_APPLIED.md](FIXES_APPLIED.md)** - Registro de Correcciones
- Historial de bugs resueltos
- Soluciones aplicadas
- Lecciones aprendidas

---

## 🔒 Seguridad y Compliance

### 8. **[access_control_policy.md](access_control_policy.md)** - Política de Control de Acceso
- Definición de roles (RBAC)
- Permisos por rol
- Políticas de seguridad
- Gestión de usuarios

### 9. **[audit_procedure.md](audit_procedure.md)** - Procedimientos de Auditoría
- Sistema de audit logging
- Qué se registra y por qué
- Cómo consultar logs de auditoría
- Retención de registros

### 10. **[incident_response.md](incident_response.md)** - Plan de Respuesta a Incidentes
- Procedimientos ante brechas de seguridad
- Equipo de respuesta
- Escalamiento de incidentes
- Comunicación con afectados

### 11. **[retention_policy.md](retention_policy.md)** - Política de Retención de Datos
- Períodos de retención por tipo de dato
- Proceso de eliminación
- Cumplimiento CCPA
- Auditorías de retención

### 12. **[change_management.md](change_management.md)** - Gestión de Cambios
- Proceso de aprobación de cambios
- Control de versiones
- Rollback procedures

---

## 🧪 Testing y Calidad

### 13. **Scripts de Verificación**
- `scripts/verify_ccpa.js` - Verificación de cumplimiento CCPA
- `scripts/create_views.ts` - Creación de vistas de base de datos
- `verify-system.js` - Verificación de configuración del sistema

---

## 📊 Estado de la Documentación

| Documento | Estado | Última Actualización |
|-----------|--------|---------------------|
| README.md | ✅ Actualizado | 2025-12-06 |
| VERSIONING.md | ✅ Nuevo | 2025-12-06 |
| CHANGELOG.md | ✅ Auto-generado | 2025-12-07 |
| COMMIT_CONVENTION.md | ✅ Nuevo | 2025-12-06 |
| IMPLEMENTATION_PLAN.md | ✅ Actualizado | 2025-12-06 |
| DEPLOYMENT.md | ✅ Actualizado | 2025-12-05 |
| FIXES_APPLIED.md | ✅ Actualizado | 2025-12-06 |
| access_control_policy.md | ✅ Actualizado | 2025-12-06 |
| audit_procedure.md | ✅ Actualizado | 2025-12-06 |
| incident_response.md | ✅ Actualizado | 2025-12-06 |
| retention_policy.md | ✅ Actualizado | 2025-12-06 |
| change_management.md | ✅ Actualizado | 2025-12-06 |

---

## 🎓 Para Nuevos Desarrolladores

**Orden de lectura recomendado:**

1. **[README.md](README.md)** - Para entender qué es el proyecto
2. **[VERSIONING.md](VERSIONING.md)** - Para aprender el flujo de trabajo
3. **[.github/COMMIT_CONVENTION.md](.github/COMMIT_CONVENTION.md)** - Para referencia rápida
4. **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - Para entender la arquitectura
5. **[access_control_policy.md](access_control_policy.md)** - Para entender RBAC

---

## 🔄 Para Contribuidores Existentes

**Consulta frecuente:**

- 💻 **Haciendo commits:** [COMMIT_CONVENTION.md](.github/COMMIT_CONVENTION.md)
- 🚀 **Creando releases:** [VERSIONING.md](VERSIONING.md)
- 🐛 **Reportando bugs:** [FIXES_APPLIED.md](FIXES_APPLIED.md)
- 🔒 **Temas de seguridad:** [access_control_policy.md](access_control_policy.md)

---

## 📝 Notas Importantes

### ⚠️ NO EDITAR MANUALMENTE:
- `CHANGELOG.md` - Se genera automáticamente
- `package.json` (version) - Se actualiza con `npm run release`

### ✅ SIEMPRE ACTUALIZAR:
- `FIXES_APPLIED.md` - Al resolver bugs
- `IMPLEMENTATION_PLAN.md` - Al completar features
- Documentación de compliance - Al cambiar políticas

### 🔄 GENERADO AUTOMÁTICAMENTE:
- `CHANGELOG.md` - Por standard-version
- Tags de Git - Por standard-version
- Versión en package.json - Por standard-version

---

## 🆘 ¿Necesitas Ayuda?

1. **Problemas técnicos:** Ver [README.md](README.md) sección Troubleshooting
2. **Dudas sobre commits:** Ver [COMMIT_CONVENTION.md](.github/COMMIT_CONVENTION.md)
3. **Dudas sobre releases:** Ver [VERSIONING.md](VERSIONING.md)
4. **Temas de seguridad:** Contactar al equipo de IT

---

## 📦 Archivos de Configuración

### Sistema de Versionamiento
- `commitlint.config.js` - Configuración de commitlint
- `.versionrc.json` - Configuración de standard-version
- `.husky/commit-msg` - Hook para validar commits
- `.husky/pre-commit` - Hook pre-commit (tests deshabilitados)

### Base de Datos
- `prisma/schema.prisma` - Schema de base de datos
- `prisma/seed.ts` - Seed principal
- `prisma/seed_real_org.ts` - Seed con datos organizacionales

### Build y Deploy
- `Dockerfile` - Configuración Docker
- `next.config.ts` - Configuración Next.js
- `tailwind.config.js` - Configuración Tailwind
- `tsconfig.json` - Configuración TypeScript

---

**Última revisión:** 2025-12-06  
**Mantenido por:** DiligentOS Team  
**Versión del proyecto:** v0.1.0
