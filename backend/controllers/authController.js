const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/db');

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// POST /api/auth/register/volunteer
exports.registerVolunteer = async (req, res) => {
  const { email, password, name, last_name, phone, city, birth_date, tagIds } = req.body;
  if (!email || !password || !name || !last_name)
    return res.status(400).json({ error: 'Campos obligatorios: email, password, name, last_name' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [exist] = await conn.query('SELECT id FROM users WHERE email=?', [email]);
    if (exist.length) return res.status(409).json({ error: 'El email ya está registrado' });

    const hash = await bcrypt.hash(password, 12);
    const [userRes] = await conn.query(
      'INSERT INTO users (email, password, role) VALUES (?,?,?)',
      [email, hash, 'volunteer']
    );
    const userId = userRes.insertId;

    const [volRes] = await conn.query(
      'INSERT INTO volunteers (user_id, name, last_name, phone, city, birth_date) VALUES (?,?,?,?,?,?)',
      [userId, name, last_name, phone || null, city || null, birth_date || null]
    );
    const volId = volRes.insertId;

    if (Array.isArray(tagIds) && tagIds.length) {
      const tagRows = tagIds.map(t => [volId, t]);
      await conn.query('INSERT IGNORE INTO volunteer_tags (volunteer_id, tag_id) VALUES ?', [tagRows]);
    }

    await conn.commit();
    const token = signToken({ id: userId, email, role: 'volunteer' });
    res.status(201).json({ token, role: 'volunteer', profileId: volId, name, last_name });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al registrar voluntario' });
  } finally {
    conn.release();
  }
};

// POST /api/auth/register/organization
exports.registerOrganization = async (req, res) => {
  const { email, password, name, description, phone, address, city, website } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ error: 'Campos obligatorios: email, password, name' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [exist] = await conn.query('SELECT id FROM users WHERE email=?', [email]);
    if (exist.length) return res.status(409).json({ error: 'El email ya está registrado' });

    const hash = await bcrypt.hash(password, 12);
    const [userRes] = await conn.query(
      'INSERT INTO users (email, password, role) VALUES (?,?,?)',
      [email, hash, 'organization']
    );
    const userId = userRes.insertId;

    const today = new Date().toISOString().slice(0, 10);
    const [orgRes] = await conn.query(
      `INSERT INTO organizations (user_id, name, description, phone, address, city, website, plan_id, month_reset_date)
       VALUES (?,?,?,?,?,?,?,1,?)`,
      [userId, name, description || null, phone || null, address || null, city || null, website || null, today]
    );

    await conn.commit();
    const token = signToken({ id: userId, email, role: 'organization' });
    res.status(201).json({ token, role: 'organization', profileId: orgRes.insertId, name });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al registrar organización' });
  } finally {
    conn.release();
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for email=${email} ip=${req.ip} host=${req.get('host')}`);
  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos' });

  const [users] = await db.query('SELECT * FROM users WHERE email=?', [email]);
  if (!users.length) return res.status(401).json({ error: 'Credenciales inválidas' });

  const user = users[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

  // Obtener profileId según rol
  let profileId = null, profileName = '';
  if (user.role === 'volunteer') {
    const [v] = await db.query('SELECT id, name, last_name FROM volunteers WHERE user_id=?', [user.id]);
    if (v.length) { profileId = v[0].id; profileName = `${v[0].name} ${v[0].last_name}`; }
  } else {
    const [o] = await db.query('SELECT id, name, plan_id FROM organizations WHERE user_id=?', [user.id]);
    if (o.length) { profileId = o[0].id; profileName = o[0].name; }
  }

  const token = signToken(user);
  res.json({ token, role: user.role, profileId, name: profileName });
};

// GET /api/auth/me
exports.me = async (req, res) => {
  const [users] = await db.query('SELECT id, email, role, created_at FROM users WHERE id=?', [req.user.id]);
  if (!users.length) return res.status(404).json({ error: 'Usuario no encontrado' });

  const user = users[0];
  let profile = null;

  if (user.role === 'volunteer') {
    const [v] = await db.query(
      `SELECT v.*, GROUP_CONCAT(t.id) as tag_ids, GROUP_CONCAT(t.name) as tag_names
       FROM volunteers v
       LEFT JOIN volunteer_tags vt ON vt.volunteer_id=v.id
       LEFT JOIN tags t ON t.id=vt.tag_id
       WHERE v.user_id=? GROUP BY v.id`, [user.id]
    );
    profile = v[0] || null;
  } else {
    const [o] = await db.query(
      `SELECT o.*, p.name as plan_name, p.max_projects_monthly, p.can_view_volunteers,
              p.has_dashboard, p.has_ads, p.ad_slots, p.price as plan_price
       FROM organizations o JOIN plans p ON o.plan_id=p.id
       WHERE o.user_id=?`, [user.id]
    );
    profile = o[0] || null;
  }

  res.json({ ...user, profile });
};
