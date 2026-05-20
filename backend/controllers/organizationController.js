const db = require('../config/db');

// GET /api/organizations/:id  — vista pública
exports.getPublic = async (req, res) => {
  const [rows] = await db.query(
    `SELECT o.id, o.name, o.description, o.city, o.website, o.avatar_url, o.banner_url,
            p.name as plan_name
     FROM organizations o JOIN plans p ON o.plan_id=p.id
     WHERE o.id=?`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Organización no encontrada' });
  res.json(rows[0]);
};

// GET /api/organizations/:id/full  — perfil completo (solo la propia org)
exports.getFull = async (req, res) => {
  const [u] = await db.query('SELECT user_id FROM organizations WHERE id=?', [req.params.id]);
  if (!u.length || u[0].user_id !== req.user.id)
    return res.status(403).json({ error: 'Acceso denegado' });

  const [rows] = await db.query(
    `SELECT o.*, p.name as plan_name, p.price as plan_price,
            p.max_projects_monthly, p.can_view_volunteers, p.has_dashboard,
            p.has_ads, p.ad_slots
     FROM organizations o JOIN plans p ON o.plan_id=p.id
     WHERE o.id=?`,
    [req.params.id]
  );
  res.json(rows[0]);
};

// PUT /api/organizations/:id
exports.update = async (req, res) => {
  const { name, description, phone, address, city, website, avatar_url, banner_url } = req.body;
  const [u] = await db.query('SELECT user_id FROM organizations WHERE id=?', [req.params.id]);
  if (!u.length || u[0].user_id !== req.user.id)
    return res.status(403).json({ error: 'Acceso denegado' });

  await db.query(
    `UPDATE organizations SET
     name=COALESCE(?,name), description=COALESCE(?,description),
     phone=COALESCE(?,phone), address=COALESCE(?,address),
     city=COALESCE(?,city), website=COALESCE(?,website),
     avatar_url=COALESCE(?,avatar_url), banner_url=COALESCE(?,banner_url)
     WHERE id=?`,
    [name, description, phone, address, city, website, avatar_url, banner_url, req.params.id]
  );
  res.json({ message: 'Perfil actualizado' });
};

// GET /api/organizations/:id/volunteers  — gestión voluntarios (Starter+)
exports.getVolunteers = async (req, res) => {
  const [u] = await db.query('SELECT user_id FROM organizations WHERE id=?', [req.params.id]);
  if (!u.length || u[0].user_id !== req.user.id)
    return res.status(403).json({ error: 'Acceso denegado' });

  const { status } = req.query; // pending | accepted | rejected
  let where = 'WHERE p.organization_id=?';
  const params = [req.params.id];
  if (status) { where += ' AND pa.status=?'; params.push(status); }

  const [rows] = await db.query(
    `SELECT vol.id, vol.name, vol.last_name, vol.avatar_url, vol.city, vol.phone,
            pa.status as application_status, pa.applied_at, pa.id as application_id,
            p.id as project_id, p.title as project_title,
            COUNT(DISTINCT pa2.project_id) as projects_with_org
     FROM project_applications pa
     JOIN volunteers vol ON vol.id=pa.volunteer_id
     JOIN projects p ON p.id=pa.project_id
     LEFT JOIN project_applications pa2 ON pa2.volunteer_id=vol.id
       AND pa2.project_id IN (SELECT id FROM projects WHERE organization_id=?)
       AND pa2.status='accepted'
     ${where}
     GROUP BY vol.id, pa.id
     ORDER BY pa.applied_at DESC`,
    [req.params.id, ...params]
  );
  res.json(rows);
};

// GET /api/organizations/:id/dashboard  — estadísticas (Professional+)
exports.getDashboard = async (req, res) => {
  const [u] = await db.query('SELECT user_id FROM organizations WHERE id=?', [req.params.id]);
  if (!u.length || u[0].user_id !== req.user.id)
    return res.status(403).json({ error: 'Acceso denegado' });

  const orgId = req.params.id;

  const [[totals]] = await db.query(
    `SELECT
       COUNT(*) as total,
       SUM(status='recruiting') as recruiting,
       SUM(status='active') as active,
       SUM(status='completed') as completed,
       SUM(status='cancelled') as cancelled
     FROM projects WHERE organization_id=?`, [orgId]
  );

  const [byMonth] = await db.query(
    `SELECT DATE_FORMAT(created_at,'%Y-%m') as month, COUNT(*) as count
     FROM projects WHERE organization_id=?
     GROUP BY month ORDER BY month DESC LIMIT 12`, [orgId]
  );

  const [[volStats]] = await db.query(
    `SELECT COUNT(DISTINCT pa.volunteer_id) as total_volunteers,
            SUM(pa.status='accepted') as accepted,
            SUM(pa.status='pending') as pending,
            SUM(pa.status='rejected') as rejected
     FROM project_applications pa
     JOIN projects p ON p.id=pa.project_id
     WHERE p.organization_id=?`, [orgId]
  );

  res.json({ projects: totals, byMonth, volunteers: volStats });
};
