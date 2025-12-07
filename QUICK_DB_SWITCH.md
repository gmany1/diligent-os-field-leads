# 🔄 Guía Rápida: Cambiar entre SQLite y PostgreSQL

## 🎯 Configuración Actual del Proyecto

- **Desarrollo Local:** SQLite ✅
- **Producción (Coolify):** PostgreSQL ✅

---

## 💻 Para Desarrollo Local (SQLite)

### 1. Cambiar a SQLite

```bash
npm run db:sqlite
```

### 2. Actualizar tu `.env`

```env
DATABASE_URL="file:./dev.db"
```

### 3. Regenerar cliente y aplicar schema

```bash
npx prisma generate
npx prisma db push
npm run db:setup  # Para seed
```

### 4. Iniciar desarrollo

```bash
npm run dev
```

---

## 🚀 Para Producción (PostgreSQL en Coolify)

### 1. Cambiar a PostgreSQL (antes de hacer commit)

```bash
npm run db:postgres
```

### 2. Verificar que `.env` en Coolify tenga:

```env
DATABASE_URL=postgresql://user:password@postgres:5432/diligent_leads?schema=public
```

### 3. Hacer commit y push

```bash
git add .
git commit -m "chore: switch to postgresql for production"
git push origin master
```

### 4. En Coolify (primer deploy)

Las migraciones se ejecutarán automáticamente en el build.

---

## 📋 Flujo de Trabajo Recomendado

### Cuando trabajas localmente:

1. **Asegúrate de estar en SQLite:**
   ```bash
   npm run db:sqlite
   npx prisma generate
   ```

2. **Verifica tu `.env`:**
   ```env
   DATABASE_URL="file:./dev.db"
   ```

3. **Desarrolla normalmente:**
   ```bash
   npm run dev
   ```

### Cuando vas a hacer deploy:

1. **Cambia a PostgreSQL:**
   ```bash
   npm run db:postgres
   npx prisma generate
   ```

2. **Haz commit:**
   ```bash
   git add prisma/schema.prisma
   git commit -m "chore: switch to postgresql for production"
   git push origin master
   ```

3. **Coolify hará el deploy automáticamente**

### Después del deploy, vuelve a SQLite localmente:

```bash
npm run db:sqlite
npx prisma generate
```

---

## 🔧 Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run db:sqlite` | Cambiar schema a SQLite |
| `npm run db:postgres` | Cambiar schema a PostgreSQL |
| `npx prisma generate` | Regenerar cliente Prisma |
| `npx prisma db push` | Aplicar schema (SQLite) |
| `npx prisma migrate dev` | Crear migración (PostgreSQL) |
| `npx prisma studio` | Abrir GUI para ver datos |

---

## ⚠️ Importante

### NO commitear con SQLite si vas a producción

Antes de hacer push a master, **SIEMPRE** verifica:

```bash
# Ver qué provider está activo
grep "provider" prisma/schema.prisma
```

Debe mostrar:
```prisma
provider = "postgresql"  # ✅ Para producción
```

NO:
```prisma
provider = "sqlite"  # ❌ No en producción
```

---

## 🐛 Troubleshooting

### Error: "the URL must start with the protocol 'file:'"

**Causa:** Estás usando SQLite pero tu `.env` tiene PostgreSQL URL (o viceversa)

**Solución:**
```bash
# Si usas SQLite localmente:
npm run db:sqlite
# Luego actualiza .env a: DATABASE_URL="file:./dev.db"

# Si usas PostgreSQL:
npm run db:postgres
# Luego actualiza .env a: DATABASE_URL="postgresql://..."
```

### Error: "Can't reach database server"

**Causa:** Schema está en PostgreSQL pero no tienes servidor PostgreSQL corriendo

**Solución:**
```bash
npm run db:sqlite
npx prisma generate
```

---

## 📝 Checklist Antes de Deploy

- [ ] Ejecutar `npm run db:postgres`
- [ ] Ejecutar `npx prisma generate`
- [ ] Verificar que schema.prisma tenga `provider = "postgresql"`
- [ ] Commit y push
- [ ] Verificar variables de entorno en Coolify
- [ ] Después del deploy, volver a SQLite localmente

---

## 🎯 Estado Actual

```
✅ Script switch-db.js creado
✅ npm run db:sqlite configurado
✅ npm run db:postgres configurado
✅ Schema actual: SQLite (para desarrollo local)
✅ Coolify configurado con PostgreSQL
```

---

**Última actualización:** 2025-12-06  
**Configuración local actual:** SQLite
