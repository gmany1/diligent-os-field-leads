# Scalability: Transitioning to PostgreSQL

This project is currently configured to use SQLite for development simplicity. However, for production and scalability, we recommend switching to PostgreSQL.

## Prerequisites

- Docker and Docker Compose installed.

## Steps to Switch

1.  **Start PostgreSQL:**
    Run the following command to start a local PostgreSQL instance using Docker:
    ```bash
    docker-compose up -d
    ```

2.  **Update Environment Variables:**
    Update your `.env` file to point to the PostgreSQL database.
    Replace:
    ```env
    DATABASE_URL="file:./dev.db"
    ```
    With:
    ```env
    DATABASE_URL="postgresql://diligent_user:diligent_password@localhost:5432/diligent_os_db?schema=public"
    ```

3.  **Update Prisma Schema:**
    Open `prisma/schema.prisma` and change the provider from `sqlite` to `postgresql`.
    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    ```

4.  **Run Migrations:**
    Create the tables in the new PostgreSQL database:
    ```bash
    npx prisma migrate dev --name init_postgres
    ```

5.  **Seed Data (Optional):**
    If you want to re-seed the database:
    ```bash
    npx prisma db seed
    ```

## Why PostgreSQL?

-   **Concurrency:** Better handling of multiple simultaneous users.
-   **Data Integrity:** Stronger constraints and data types.
-   **Scalability:** Can handle much larger datasets than SQLite.
-   **Features:** Advanced features like JSONB, full-text search (if needed in future).
