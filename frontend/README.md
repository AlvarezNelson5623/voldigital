# VolDigital — Frontend

React + Vite. Modo claro/oscuro, responsive.

## Crear el proyecto (una sola vez)

```bash
npm create vite@latest frontend -- --template react
cd frontend
```

## Instalar dependencias

```bash
npm install axios react-router-dom react-icons recharts react-hot-toast
```

## Copiar los archivos fuente

Reemplaza la carpeta `src/` generada por Vite con la carpeta `src/` de este proyecto.  
También reemplaza `index.html` y `vite.config.js`.

## Variables de entorno

El archivo `.env` ya está incluido. Si cambias el puerto del backend, edítalo:

```
VITE_API_URL=http://localhost:3001/api
```

## Ejecutar

```bash
npm run dev
```

El frontend queda en: http://localhost:5173

## Estructura

```
src/
├── context/
│   ├── AuthContext.jsx      # Usuario autenticado global
│   └── ThemeContext.jsx     # Modo claro/oscuro
├── services/
│   └── api.js               # Instancia Axios + helpers
├── utils/
│   └── constants.js         # Constantes globales
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx       # Barra superior pública
│   │   └── Sidebar.jsx      # Sidebar autenticado
│   └── common/
│       ├── ProjectCard.jsx
│       ├── TagBadge.jsx
│       ├── NotificationCenter.jsx
│       └── AdvertisementCarousel.jsx
└── pages/
    ├── Home.jsx             # Página pública principal
    ├── Login.jsx
    ├── Register.jsx         # Elegir rol
    ├── RegisterVolunteer.jsx
    ├── RegisterOrganization.jsx
    ├── volunteer/           # Módulos del voluntario
    └── organization/        # Módulos de la organización
```
