# 🗄️ Guía de Configuración de Base de Datos

## 📋 Estrategia Multi-Entorno

Este proyecto está configurado para usar:
- **PostgreSQL** en **PRODUCCIÓN** (VPS/Coolify) ✅ Recomendado
- **SQLite** en **DESARROLLO LOCAL** (opcional)

---

## 🚀 Configuración para PRODUCCIÓN (VPS)

### 1. PostgreSQL en el VPS

**DATABASE_URL en producción:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/diligent_leads?schema=public"
```

### 2. Configuración en Coolify

En las variables de entorno de Coolify, configura:

```env
DATABASE_URL=postgresql://diligent_user:STRONG_PASSWORD@postgres:5432/diligent_leads?schema=public
AUTH_SECRET=tu-secret-key-generado
NEXTAUTH_URL=https://tu-dominio.com
NODE_ENV=production
```

### 3. Crear Base de Datos PostgreSQL

Si usas Coolify con PostgreSQL:

```bash
# Coolify creará automáticamente la base de datos
# Solo necesitas configurar el DATABASE_URL correcto
```

Si configuras manualmente:

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE diligent_leads;

# Crear usuario
CREATE USER diligent_user WITH PASSWORD 'tu_password_seguro';

# Dar permisos
GRANT ALL PRIVILEGES ON DATABASE diligent_leads TO diligent_user;
```

### 4. Ejecutar Migraciones en Producción

```bash
# En el VPS o contenedor
npx prisma migrate deploy

# Seed inicial (solo primera vez)
npx tsx prisma/seed_real_org.ts
```

---

## 💻 Configuración para DESARROLLO LOCAL

### Opción 1: SQLite (Más Simple)

**En tu `.env` local:**
```env
DATABASE_URL="file:./dev.db"
```

**Setup:**
```bash
npx prisma db push
npm run db:setup
```

### Opción 2: PostgreSQL Local (Más Realista)

**Instalar PostgreSQL localmente:**
```bash
# Windows (con Chocolatey)
choco install postgresql

# O descargar desde: https://www.postgresql.org/download/
```

**En tu `.env` local:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/diligent_leads_dev?schema=public"
```

**Setup:**
```bash
# Crear base de datos
createdb diligent_leads_dev

# Ejecutar migraciones
npx prisma migrate dev

# Seed
npm run db:setup
```

---

## 🔄 Cambiar entre SQLite y PostgreSQL

### De SQLite a PostgreSQL:

1. **Actualizar `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"  // Cambiar de "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. **Actualizar `.env`:**
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
   ```

3. **Regenerar cliente y migrar:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name switch_to_postgres
   ```

### De PostgreSQL a SQLite:

1. **Actualizar `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. **Actualizar `.env`:**
   ```env
   DATABASE_URL="file:./dev.db"
   ```

3. **Regenerar cliente:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

---

## 📊 Estado Actual del Proyecto

### Schema Prisma:
```prisma
datasource db {
  provider = "postgresql"  // ✅ Configurado para producción
  url      = env("DATABASE_URL")
}
```

### Recomendaciones:

| Entorno | Base de Datos | DATABASE_URL |
|---------|---------------|--------------|
| **Producción (VPS)** | PostgreSQL | `postgresql://user:pass@host:5432/db` |
| **Desarrollo Local** | SQLite o PostgreSQL | `file:./dev.db` o PostgreSQL local |
| **Testing** | SQLite | `file:./test.db` |

---

## 🛠️ Comandos Útiles

### Prisma Studio (GUI para ver datos)
```bash
npx prisma studio
```

### Ver estado de migraciones
```bash
npx prisma migrate status
```

### Resetear base de datos (⚠️ CUIDADO)
```bash
# Solo en desarrollo
npx prisma migrate reset
```

### Generar cliente Prisma
```bash
npx prisma generate
```

### Crear nueva migración
```bash
npx prisma migrate dev --name nombre_descriptivo
```

---

## 🔒 Seguridad

### ✅ Buenas Prácticas:

1. **Nunca** commitear el archivo `.env`
2. **Siempre** usar contraseñas fuertes en producción
3. **Rotar** el `AUTH_SECRET` regularmente
4. **Usar** conexiones SSL en producción:
   ```env
   DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
   ```

### 🔐 Generar AUTH_SECRET seguro:
```bash
openssl rand -base64 32
```

---

## 🐛 Troubleshooting

### Error: "the URL must start with the protocol 'file:'"
**Solución:** Verifica que tu DATABASE_URL tenga el formato correcto:
```env
DATABASE_URL="file:./dev.db"  # ✅ Correcto
DATABASE_URL="./dev.db"       # ❌ Incorrecto
```

### Error: "Can't reach database server"
**Solución:** 
1. Verifica que PostgreSQL esté corriendo
2. Verifica credenciales en DATABASE_URL
3. Verifica que el puerto 5432 esté abierto

### Error: "Database does not exist"
**Solución:**
```bash
createdb nombre_de_tu_base_de_datos
```

### Error: Prisma Client out of sync
**Solución:**
```bash
npx prisma generate
```

---

## 📚 Recursos

- [Prisma Docs - PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Prisma Docs - SQLite](https://www.prisma.io/docs/concepts/database-connectors/sqlite)
- [PostgreSQL Download](https://www.postgresql.org/download/)
- [Coolify Database Docs](https://coolify.io/docs/databases)

---

**Última actualización:** 2025-12-06  
**Configuración actual:** PostgreSQL (Producción Ready)
