# VolDigital — Backend

API REST construida con Express.js + MySQL.

## Requisitos
- Node.js v18+ (tienes v22 ✓)
- XAMPP corriendo (Apache + MySQL)
- Base de datos `voldigital` creada desde `voldigital.sql`

## Instalación

```bash
cd backend
npm install
```

Esto instala: express, mysql2, jsonwebtoken, bcryptjs, multer, cors, dotenv, nodemon.

## Configuración

El archivo `.env` ya está creado con valores por defecto para XAMPP.  
Si tu MySQL tiene contraseña, edita `DB_PASSWORD`.

## Ejecutar

```bash
# Desarrollo (auto-reload)
npm run dev

# Producción
npm start
```

El servidor queda en: http://localhost:3001

## Estructura

```
backend/
├── server.js              # Entrada principal
├── config/
│   └── db.js              # Conexión MySQL
├── middleware/
│   ├── auth.js            # Verificación JWT
│   └── planCheck.js       # Límites por plan
├── controllers/           # Lógica de negocio
├── routes/                # Definición de endpoints
└── uploads/               # Imágenes subidas
```

## Endpoints principales

| Método | Ruta                              | Descripción                  |
|--------|-----------------------------------|------------------------------|
| POST   | /api/auth/register/volunteer      | Registro voluntario          |
| POST   | /api/auth/register/organization   | Registro organización        |
| POST   | /api/auth/login                   | Login                        |
| GET    | /api/auth/me                      | Perfil actual (token)        |
| GET    | /api/projects                     | Proyectos públicos           |
| POST   | /api/projects                     | Crear proyecto (org)         |
| PUT    | /api/projects/:id/complete        | Marcar completado (org)      |
| POST   | /api/applications                 | Postular a proyecto (vol)    |
| PUT    | /api/applications/:id             | Aceptar/rechazar (org)       |
| GET    | /api/certificates/volunteer/:id   | Certificados del voluntario  |
| POST   | /api/certificates/:id/pay         | Simular pago descarga        |
| GET    | /api/advertisements/active        | Anuncios activos (público)   |
| GET    | /api/notifications                | Centro notificaciones        |
