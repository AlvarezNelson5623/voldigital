require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// ── Middlewares globales ─────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Archivos estáticos (imágenes subidas) ────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Rutas API ────────────────────────────────────────────
app.use('/api/auth',           require('./routes/auth'));
app.use('/api/volunteers',     require('./routes/volunteers'));
app.use('/api/organizations',  require('./routes/organizations'));
app.use('/api/projects',       require('./routes/projects'));
app.use('/api/applications',   require('./routes/applications'));
app.use('/api/certificates',   require('./routes/certificates'));
app.use('/api/notifications',  require('./routes/notifications'));
app.use('/api/tags',           require('./routes/tags'));
app.use('/api/plans',          require('./routes/plans'));
app.use('/api/advertisements', require('./routes/advertisements'));
app.use('/api/upload',         require('./routes/upload'));

// ── Health check ─────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ── 404 ──────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// ── Error handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 VolDigital API corriendo en http://localhost:${PORT}`);
});
