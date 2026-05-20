const db = require('../config/db');

// GET /api/volunteers/:id  — vista pública básica (para org ver si acepta)
exports.getPublic = async (req, res) => {
  const [rows] = await db.query(
    `SELECT v.id, v.name, v.last_name, v.bio, v.city, v.avatar_url, v.banner_url, v.phone,
            GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ',') as tags
     FROM volunteers v
     LEFT JOIN volunteer_tags vt ON vt.volunteer_id=v.id
     LEFT JOIN tags t ON t.id=vt.tag_id
     WHERE v.id=? GROUP BY v.id`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Voluntario no encontrado' });
  res.json(rows[0]);
};

// GET /api/volunteers/:id/full  — perfil completo (solo el propio voluntario)
exports.getFull = async (req, res) => {
  const [rows] = await db.query(
    `SELECT v.*,
            JSON_ARRAYAGG(JSON_OBJECT('id', t.id, 'name', t.name, 'color', t.color)) as tags
     FROM volunteers v
     LEFT JOIN volunteer_tags vt ON vt.volunteer_id=v.id
     LEFT JOIN tags t ON t.id=vt.tag_id
     WHERE v.id=? GROUP BY v.id`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'No encontrado' });

  // Verify ownership
  const [u] = await db.query('SELECT user_id FROM volunteers WHERE id=?', [req.params.id]);
  if (!u.length || u[0].user_id !== req.user.id)
    return res.status(403).json({ error: 'Acceso denegado' });

  const vol = rows[0];
  // Parse tags JSON (puede venir como string)
  try { if (typeof vol.tags === 'string') vol.tags = JSON.parse(vol.tags); } catch {}
  vol.tags = (vol.tags || []).filter(t => t.id !== null);
  res.json(vol);
};

// PUT /api/volunteers/:id
exports.update = async (req, res) => {
  const { name, last_name, bio, phone, city, birth_date, avatar_url, banner_url, tagIds } = req.body;

  const [u] = await db.query('SELECT user_id FROM volunteers WHERE id=?', [req.params.id]);
  if (!u.length || u[0].user_id !== req.user.id)
    return res.status(403).json({ error: 'Acceso denegado' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      `UPDATE volunteers SET name=COALESCE(?,name), last_name=COALESCE(?,last_name),
       bio=COALESCE(?,bio), phone=COALESCE(?,phone), city=COALESCE(?,city),
       birth_date=COALESCE(?,birth_date), avatar_url=COALESCE(?,avatar_url),
       banner_url=COALESCE(?,banner_url) WHERE id=?`,
      [name, last_name, bio, phone, city, birth_date, avatar_url, banner_url, req.params.id]
    );

    if (Array.isArray(tagIds)) {
      await conn.query('DELETE FROM volunteer_tags WHERE volunteer_id=?', [req.params.id]);
      if (tagIds.length) {
        const rows = tagIds.map(t => [req.params.id, t]);
        await conn.query('INSERT IGNORE INTO volunteer_tags (volunteer_id, tag_id) VALUES ?', [rows]);
      }
    }

    await conn.commit();
    res.json({ message: 'Perfil actualizado' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: 'Error al actualizar perfil' });
  } finally {
    conn.release();
  }
};

// GET /api/volunteers/:id/projects  — proyectos del voluntario (mis proyectos)
exports.getProjects = async (req, res) => {
  const [u] = await db.query('SELECT user_id FROM volunteers WHERE id=?', [req.params.id]);
  if (!u.length || u[0].user_id !== req.user.id)
    return res.status(403).json({ error: 'Acceso denegado' });

  const [rows] = await db.query(
    `SELECT p.id, p.title, p.description, p.image_url, p.status, p.start_date, p.end_date,
            p.location, o.name as org_name, o.avatar_url as org_avatar,
            pa.status as application_status, pa.applied_at,
            GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ',') as tags
     FROM project_applications pa
     JOIN projects p ON p.id=pa.project_id
     JOIN organizations o ON o.id=p.organization_id
     LEFT JOIN project_tags pt ON pt.project_id=p.id
     LEFT JOIN tags t ON t.id=pt.tag_id
     WHERE pa.volunteer_id=?
     GROUP BY p.id, pa.id
     ORDER BY pa.applied_at DESC`,
    [req.params.id]
  );
  res.json(rows);
};
