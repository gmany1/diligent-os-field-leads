# Despliegue en Coolify

Esta aplicación está optimizada para ser desplegada en [Coolify](https://coolify.io/), una plataforma PaaS auto-alojada.

## Requisitos Previos

1.  Una instancia de Coolify funcionando.
2.  Una base de datos PostgreSQL (puede ser aprovisionada dentro de Coolify o externa).

## Pasos para el Despliegue

1.  **Crear un Nuevo Servicio:**
    *   En Coolify, ve a tu Proyecto > Entorno (Environment).
    *   Haz clic en "+ New Resource".
    *   Selecciona "Git Repository" (Público o Privado).
    *   Conecta tu repositorio de GitHub/GitLab.

2.  **Configuración:**
    *   **Build Pack:** Selecciona `Docker` (ya que hemos incluido un `Dockerfile` optimizado).
    *   **Port:** `3000` (Puerto expuesto).

3.  **Variables de Entorno:**
    Añade las siguientes variables en el panel de Coolify para tu servicio:

    ```env
    DATABASE_URL="postgresql://usuario:password@host:5432/nombre_db?schema=public"
    AUTH_SECRET="tu_secreto_generado" # Genera uno con `npx auth secret` o `openssl rand -base64 32`
    AUTH_URL="https://tu-dominio.com" # La URL final de tu aplicación
    ```

    *Nota: Si usas una base de datos creada dentro de Coolify, usa la cadena de conexión interna que te proporciona Coolify.*

4.  **Migración de Base de Datos:**
    Dado que es un despliegue en contenedor, necesitas ejecutar las migraciones.

    *   **Opción A (Comando Post-Despliegue - Recomendado):**
        En la configuración de Coolify, busca "Post-deployment command" y añade:
        ```bash
        npx prisma migrate deploy
        ```
        *Nota: Esto requiere que el contenedor tenga acceso a la DB.*

    *   **Opción B (Manual):**
        Conéctate a la base de datos desde tu máquina local (usando la URL externa de la DB) y ejecuta:
        ```bash
        npx prisma migrate deploy
        ```

5.  **Desplegar:**
    *   Haz clic en "Deploy".
    *   Coolify construirá la imagen Docker usando el `Dockerfile` incluido y arrancará el contenedor.

## Solución de Problemas

*   **Error de Conexión a DB:** Asegúrate de que `DATABASE_URL` es correcta. Si la DB y la App están en el mismo Coolify, usa el nombre de red interno (ej. `postgresql://postgres:password@uuid-de-la-db:5432/...`).
*   **Fallos de Build:** Revisa los "Build Logs". El `Dockerfile` usa una construcción multi-etapa para reducir el tamaño final.
