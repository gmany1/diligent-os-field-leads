# Guía de Despliegue en Contabo (VPS) - DiligentOS Field Leads

Esta guía detalla los pasos para desplegar tu aplicación Next.js en un servidor VPS de Contabo usando Ubuntu, Nginx y SSL.

## 1. Preparación en Contabo
1.  **Comprar VPS:** Selecciona "Cloud VPS S" (o superior).
2.  **Sistema Operativo:** Elige **Ubuntu 22.04 LTS** o **24.04 LTS**.
3.  **Acceso:** Recibirás la IP y la contraseña de `root` por correo.

## 2. Subir Código a GitHub
Asegúrate de que tu código local esté en GitHub.
```bash
git add .
git commit -m "Preparando para despliegue"
# Si no has vinculado el repo remoto aún:
# git remote add origin https://github.com/TU_USUARIO/diligent-os-field-leads.git
git push origin master
```

## 3. Configuración del Servidor (SSH)
Conéctate a tu servidor:
```bash
ssh root@TU_IP_CONTABO
# Ingresa la contraseña cuando te la pida
```

### Actualizar el sistema e instalar herramientas básicas
```bash
apt update && apt upgrade -y
apt install -y git curl nginx certbot python3-certbot-nginx
```

### Opcional: Instalar PostgreSQL (Base de Datos Local)
Si no usas una base de datos externa (como Neon o Supabase), instálala en el VPS:
```bash
apt install -y postgresql postgresql-contrib
systemctl start postgresql
# Crear usuario y base de datos
sudo -u postgres psql
# Dentro de la consola SQL:
# CREATE USER diligent_user WITH PASSWORD 'tu_contraseña_segura';
# CREATE DATABASE diligent_db OWNER diligent_user;
# \q
```
*Tu DATABASE_URL en el .env sería: `postgresql://diligent_user:tu_contraseña_segura@localhost:5432/diligent_db`*

### Instalar Node.js (Versión 18 o 20 LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
# Verificar instalación
node -v
npm -v
```

### Instalar PM2 (Gestor de Procesos)
PM2 mantendrá tu app viva siempre.
```bash
npm install -g pm2
```

## 4. Desplegar la Aplicación

### Clonar el Repositorio
```bash
cd /var/www
git clone https://github.com/TU_USUARIO/diligent-os-field-leads.git
cd diligent-os-field-leads
```

### Instalar Dependencias y Construir
```bash
npm install
# Crear archivo de entorno (copia el ejemplo o crea uno nuevo)
cp .env.example .env
nano .env
# EDITA TU .ENV: Asegúrate de poner DATABASE_URL, NEXTAUTH_SECRET, etc.
# Para guardar en nano: Ctrl+O, Enter, Ctrl+X

# Construir la app
npm run build
```

### Iniciar con PM2
```bash
pm2 start npm --name "diligent-os" -- start
pm2 save
pm2 startup
# Ejecuta el comando que te diga pm2 startup para que inicie con el sistema
```

## 5. Configurar Nginx (Reverse Proxy)
Nginx recibirá el tráfico web y lo pasará a tu app (puerto 3000).

1.  Borrar configuración por defecto:
    ```bash
    rm /etc/nginx/sites-enabled/default
    ```
2.  Crear nueva configuración:
    ```bash
    nano /etc/nginx/sites-available/diligent-os
    ```
3.  Pega esto (cambia `tu-dominio.com`):
    ```nginx
    server {
        listen 80;
        server_name tu-dominio.com www.tu-dominio.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
4.  Activar el sitio y reiniciar Nginx:
    ```bash
    ln -s /etc/nginx/sites-available/diligent-os /etc/nginx/sites-enabled/
    nginx -t # Verificar sintaxis
    systemctl restart nginx
    ```

## 6. Configurar Dominio y SSL (HTTPS)
1.  **DNS:** Ve a tu proveedor de dominio (GoDaddy, Namecheap, etc.) y crea un registro **A** que apunte a la **IP de tu VPS**.
2.  **Certificado SSL:**
    ```bash
    certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
    ```
    Sigue las instrucciones y elige redirigir HTTP a HTTPS.

¡Listo! Tu aplicación debería estar accesible en `https://tu-dominio.com`.

## Actualizaciones Futuras
Para actualizar tu app cuando hagas cambios:
```bash
cd /var/www/diligent-os-field-leads
git pull
npm install # Si añadiste nuevas librerías
npm run build
pm2 restart diligent-os
```

## 7. Despliegue con Docker (Coolify / Portainer)

Si prefieres usar Docker (o plataformas como Coolify), el proyecto ya incluye un `Dockerfile` optimizado.

### Requisitos
- Docker y Docker Compose instalados en el servidor.

### Pasos
1.  **Clonar el repositorio** (igual que en el paso 4).
2.  **Configurar variables de entorno**:
    Crea un archivo `.env` con las variables necesarias.
3.  **Construir y levantar el contenedor**:
    ```bash
    docker-compose up -d --build
    ```

### Notas sobre Prisma y OpenSSL
El `Dockerfile` ha sido configurado para usar `node:20-slim` (Debian) para asegurar compatibilidad con las librerías de OpenSSL requeridas por Prisma. Si encuentras errores de "libssl", asegúrate de estar usando la última versión del código y reconstruye la imagen sin caché:
```bash
docker-compose build --no-cache
docker-compose up -d
```
