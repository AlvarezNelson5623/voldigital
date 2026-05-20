# VolDigital 🌱

Plataforma digital de voluntariado social para Bucaramanga.

---

## Estructura del proyecto

```
voldigital/
├── voldigital.sql     ← Importar en phpMyAdmin
├── backend/           ← API Express.js (puerto 3001)
└── frontend/          ← React + Vite (puerto 5173)
```

---

## 1. Base de datos — XAMPP

1. Inicia XAMPP → activa **Apache** y **MySQL**
2. Abre `http://localhost/phpmyadmin`
3. Crea una base de datos llamada `voldigital`
4. Selecciónala → pestaña **Importar** → sube `voldigital.sql` → **Continuar**

---

## 2. Backend

```bash
cd backend
npm install
npm run dev
```

> API disponible en: `http://localhost:3001`

Si tu MySQL tiene contraseña, edítala en `backend/.env`:
```
DB_PASSWORD=tu_contraseña
```

---

## 3. Frontend

```bash
# Crea el proyecto Vite (solo la primera vez)
npm create vite@latest frontend-temp -- --template react
# No copies nada de frontend-temp, solo se usó para inicializar

# Entra a la carpeta frontend del proyecto
cd frontend
npm install
npm run dev
```

> App disponible en: `http://localhost:5173`

---

## Flujo rápido de demo (pitch)

1. Visita `http://localhost:5173` → ve el home público con proyectos y anuncios enterprise
2. Regístrate como **Voluntario** → selecciona intereses → ve proyectos recomendados
3. Regístrate como **Organización** → elige un plan → crea un proyecto con etiquetas e imagen
4. El voluntario aplica → la organización acepta → el voluntario recibe notificación
5. La organización marca el proyecto como completado → se generan certificados
6. El voluntario descarga su certificado (pago simulado $10.000)

---

## Tecnologías

| Capa       | Tecnología                              |
|------------|-----------------------------------------|
| Frontend   | React 18 + Vite + React Router 6        |
| Estilos    | CSS Modules + variables CSS (dark/light)|
| Gráficas   | Recharts                                |
| HTTP       | Axios                                   |
| Backend    | Express.js 4 + Node.js 22               |
| Auth       | JWT + bcryptjs                          |
| Base datos | MySQL 5.7+ (XAMPP / phpMyAdmin)         |
| Uploads    | Multer (local `/backend/uploads/`)      |
