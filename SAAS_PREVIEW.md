# 🎯 DiligentOS Field Leads - SaaS Preview

## 📱 Vista General del Sistema

**DiligentOS Field Leads** es un sistema completo de gestión de leads empresariales con arquitectura multi-branch y control de acceso basado en roles (RBAC).

---

## 🔐 Sistema de Autenticación

### Login Page
- **URL**: `http://localhost:3000/login`
- Autenticación segura con NextAuth.js
- Soporte para credenciales y preparado para SSO con Microsoft Entra ID
- Sesiones JWT con información de rol y sucursal

**Credenciales de Prueba:**
```
Email: jesus.ramos@diligentos.com
Password: password123
Rol: BRANCH_MANAGER (Los Angeles)
```

---

## 📊 Dashboard Principal

### Vista de Branch Manager
El dashboard muestra:
- **KPIs principales**: Total de Leads, Cotizaciones Activas, Acciones Pendientes, Comisiones
- **Valor del Pipeline**: Visualización del valor total en proceso
- **Tasa de Conversión**: Porcentaje de leads ganados
- **Gráficos interactivos**:
  - Velocidad de ventas
  - Pipeline por etapa
  - Actividades recientes

**Características:**
- ✅ Datos filtrados por sucursal (RBAC)
- ✅ Actualización en tiempo real
- ✅ Diseño responsive y moderno
- ✅ Tema oscuro/claro

---

## 👥 CRM - Gestión de Leads

### All Leads Page
**URL**: `http://localhost:3000/leads/all`

**Funcionalidades:**
- 📋 Lista completa de leads con paginación
- 🔍 Búsqueda avanzada por nombre, teléfono, email
- 🏢 Filtrado por sucursal (Branch)
- 📊 Información detallada:
  - Nombre del cliente
  - Etapa del pipeline (COLD, WARM, HOT, QUOTE, WON, LOST)
  - Sucursal asignada
  - Representante asignado
  - Fecha de creación
  - Actividades asociadas

**Acciones disponibles:**
- ➕ Crear nuevo lead
- ✏️ Editar lead existente
- 🗑️ Eliminar lead (con auditoría)
- 👁️ Ver detalles completos
- 📧 Enviar email
- 📞 Registrar llamada

---

## 📈 Pipeline Kanban

### Kanban Board
**URL**: `http://localhost:3000/pipeline/kanban`

**Vista de Pipeline Visual:**
- 🎯 Columnas por etapa: COLD → WARM → HOT → QUOTE → WON / LOST
- 🎨 Código de colores por etapa
- 🖱️ Drag & drop para mover leads entre etapas
- 📊 Contador de leads por columna
- 💰 Valor total por etapa

**Características:**
- ✅ Actualización automática al mover cards
- ✅ Vista rápida de información del lead
- ✅ Filtros por sucursal y representante
- ✅ Indicadores visuales de prioridad

---

## 📊 Reports & Analytics

### Reports Dashboard
**URL**: `http://localhost:3000/reports`

**Reportes Disponibles:**

#### 1. **Executive Report** (CEO, CAO, DOO)
- Vista global de todas las sucursales
- Métricas consolidadas
- Comparativas entre branches
- Tendencias de crecimiento

#### 2. **Manager Report** (Branch Managers)
- Pipeline por etapa de su sucursal
- Actividades del equipo
- Performance de representantes
- Leads estancados

#### 3. **IT Admin Report**
- Logs de auditoría
- Actividad del sistema
- Usuarios activos
- Métricas de seguridad

#### 4. **Compliance Report**
- Acciones de CCPA/GDPR
- Exportaciones de datos
- Eliminaciones de PII
- Historial de cumplimiento

---

## 🏢 Arquitectura Multi-Branch

### Sucursales Configuradas:
1. **Los Angeles** (BR-001)
   - Manager: Jesus Ramos
   - Staff: Saira Baires, Maria Centeno

2. **Norwalk** (BR-002)
   - En configuración

3. **El Monte** (BR-003)
   - Manager: Doris Ibarra
   - Staff: Alondra Gonzalez

4. **Moreno Valley** (BR-004)
   - Manager: Erika Galvez

5. **San Antonio** (BR-005)
   - Manager: Dullian Lopez
   - Staff: Manuel Cardenas

---

## 🔒 Sistema RBAC (Role-Based Access Control)

### Roles Implementados:

#### **Nivel Ejecutivo (Acceso Global)**
- `CEO` - Sal Ingles
- `CAO` - Ana Perez
- `DOO` - Ana I Gonzalez
- `AREA_DIRECTOR`

#### **Nivel Tecnología**
- `IT_SUPER_ADMIN` - Jorge Ayala
- `IT_ADMIN`

#### **Nivel Sucursal**
- `BRANCH_MANAGER` - Acceso a su sucursal
- `MANAGER` - Legacy role

#### **Nivel Operativo**
- `STAFFING_REP` - Acceso a leads asignados
- `SALES_REP` - Acceso a leads asignados
- `FIELD_LEAD_REP` - Legacy role

### Permisos por Rol:

| Acción | CEO/Exec | Manager | Rep |
|--------|----------|---------|-----|
| Ver todos los leads | ✅ | ❌ (solo su branch) | ❌ (solo asignados) |
| Crear leads | ✅ | ✅ | ✅ |
| Editar cualquier lead | ✅ | ✅ (su branch) | ❌ (solo asignados) |
| Eliminar leads | ✅ | ✅ | ❌ |
| Ver reportes globales | ✅ | ❌ | ❌ |
| Exportar datos (CCPA) | ✅ | ❌ | ❌ |
| Gestionar usuarios | ✅ (IT_ADMIN) | ❌ | ❌ |

---

## 🔍 Características Destacadas

### 1. **Auditoría Completa**
- ✅ Registro de todas las acciones críticas
- ✅ IP Address y User-Agent tracking
- ✅ Logs inmutables en base de datos
- ✅ Reportes de cumplimiento

### 2. **Seguridad**
- ✅ Autenticación JWT
- ✅ Cookies HTTPOnly
- ✅ RBAC a nivel de API
- ✅ Validación de permisos en cada endpoint

### 3. **Privacidad (CCPA/GDPR)**
- ✅ Exportación de datos personales
- ✅ Eliminación SOFT (anonimización)
- ✅ Eliminación HARD (borrado completo)
- ✅ Auditoría de acciones de privacidad

### 4. **Performance**
- ✅ Paginación en listas
- ✅ Índices en base de datos
- ✅ Caché de queries con React Query
- ✅ Optimistic updates

### 5. **UX/UI Moderno**
- ✅ Diseño responsive
- ✅ Dark mode
- ✅ Animaciones suaves
- ✅ Feedback visual inmediato

---

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **React Query** (TanStack Query)
- **Lucide Icons**

### Backend
- **Hono** (API Framework)
- **NextAuth.js 5** (Autenticación)
- **Prisma** (ORM)
- **PostgreSQL** (Base de datos)

### DevOps
- **Docker** (Containerización)
- **Coolify** (Deployment)
- **prom-client** (Métricas)

---

## 📱 Progressive Web App (PWA)

El sistema está configurado como PWA:
- ✅ Instalable en dispositivos móviles
- ✅ Funciona offline (caché de datos)
- ✅ Notificaciones push (preparado)
- ✅ Iconos y splash screens configurados

---

## 🎨 Diseño Visual

### Paleta de Colores
- **Primary**: Indigo (#4F46E5)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)
- **Neutral**: Gray scale

### Componentes Reutilizables
- KPI Cards
- Data Tables
- Modal Dialogs
- Toast Notifications
- Loading Skeletons
- Charts (Recharts)

---

## 🚀 Estado del Proyecto

### ✅ Completado
- [x] Autenticación y autorización
- [x] RBAC completo
- [x] Multi-branch architecture
- [x] CRUD de Leads
- [x] Pipeline Kanban
- [x] Sistema de reportes
- [x] Auditoría completa
- [x] CCPA/GDPR compliance
- [x] Dashboard ejecutivo
- [x] Dashboard de managers
- [x] Dashboard de reps

### 🔄 En Desarrollo
- [ ] Integración con Microsoft 365
- [ ] Sistema de comisiones automático
- [ ] Generador de cotizaciones PDF
- [ ] Detección de duplicados
- [ ] AI-powered insights

### 📋 Roadmap
- [ ] Mobile app nativa
- [ ] Integración con CRM externos
- [ ] API pública
- [ ] Webhooks
- [ ] Reportes personalizables

---

## 📞 Soporte

Para más información o soporte técnico:
- **Email**: jorge.ayala@diligentos.com
- **Rol**: IT Super Admin
- **Documentación**: Ver archivos `.md` en el repositorio

---

**Última actualización**: 2025-12-06
**Versión**: 0.1.0
**Ambiente**: Development (localhost:3000)
