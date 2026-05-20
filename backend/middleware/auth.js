const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Token requerido' });

  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role)
    return res.status(403).json({ error: `Acceso solo para ${role}` });
  next();
};

module.exports = { auth, requireRole };
