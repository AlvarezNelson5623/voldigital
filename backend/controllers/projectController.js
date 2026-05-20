const db = require('../config/db');

// GET /api/projects  — todos los proyectos (público)
exports.getAll = async (req, res) => {
  const { status, tag } = req.query;
  let where = 'WHERE 1=1';
  const params = [];
  if (status) { where += ' AND p.status=?'; params.push(status); }
  if (tag)    { where += ' AND t.name=?'; params.push(tag); }

  const [rows] = await db.query(
    `SELECT p.id, p.title, p.description, p.image_url, p.status, p.location,
            p.start_date, p.end_date, p.max_volunteers, p.created_at,
            o.id as org_id, o.name as org_name, o.avatar_url as org_avatar,
            GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ',') as tags,
            GROUP_CONCAT(DISTINCT t.color ORDER BY t.name SEPARATOR ',') as tag_colors,
            COUNT(DISTINCT pa.id) as applicants_count
     FROM projects p
     JOIN organizations o ON o.id=p.organization_id
     LEFT JOIN project_tags pt ON pt.project_id=p.id
     LEFT JOIN tags t ON t.id=pt.tag_id
     LEFT JOIN project_applications pa ON pa.project_id=p.id AND pa.status='accepted'
     ${where}
     GROUP BY p.id
     ORDER BY p.created_at DESC`,
    params
  );
  res.json(rows);
};

// GET /api/projects/recommended/:volunteerId  — proyectos por tags del voluntario
exports.getRecommended = async (req, res) => {
  const volId = req.params.volunteerId;

  const [rows] = await db.query(
    `SELECT p.id, p.title, p.description, p.image_url, p.status, p.location,
            p.start_date, p.end_date, p.max_volunteers, p.created_at,
            o.id as org_id, o.name as org_name, o.avatar_url as org_avatar,
            GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ',') as tags,
            GROUP_CONCAT(DISTINCT t.color ORDER BY t.name SEPARATOR ',') as tag_colors,
            COUNT(DISTINCT match_tag.tag_id) as match_score
     FROM projects p
     JOIN organizations o ON o.id=p.organization_id
     LEFT JOIN project_tags pt ON pt.project_id=p.id
     LEFT JOIN tags t ON t.id=pt.tag_id
     LEFT JOIN (
       SELECT pt2.tag_id FROM project_tags pt2
       WHERE pt2.tag_id IN (SELECT tag_id FROM volunteer_tags WHERE volunteer_id=?)
     ) match_tag ON match_tag.tag_id=pt.tag_id
     WHERE p.status IN ('recruiting','active')
       AND p.id NOT IN (
         SELECT project_id FROM project_applications WHERE volunteer_id=?
       )
     GROUP BY p.id
     HAVING match_score > 0
     ORDER BY match_score DESC, p.created_at DESC
     LIMIT 20`,
    [volId, volId]
  );
  res.json(rows);
};

// GET /api/projects/discover/:volunteerId  — proyectos sin match de etiquetas
exports.getDiscover = async (req, res) => {
  const volId = req.params.volunteerId;

  const [rows] = await db.query(
    `SELECT p.id, p.title, p.description, p.image_url, p.status, p.location,
            p.start_date, p.end_date, p.max_volunteers, p.created_at,
            o.id as org_id, o.name as org_name, o.avatar_url as org_avatar,
            GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ',') as tags,
            GROUP_CONCAT(DISTINCT t.color ORDER BY t.name SEPARATOR ',') as tag_colors
     FROM projects p
     JOIN organizations o ON o.id=p.organization_id
     LEFT JOIN project_tags pt ON pt.project_id=p.id
     LEFT JOIN tags t ON t.id=pt.tag_id
     WHERE p.status IN ('recruiting','active')
       AND p.id NOT IN (
         SELECT project_id FROM project_applications WHERE volunteer_id=?
       )
       AND p.id NOT IN (
         SELECT pt2.project_id FROM project_tags pt2
         WHERE pt2.tag_id IN (SELECT tag_id FROM volunteer_tags WHERE volunteer_id=?)
       )
     GROUP BY p.id
     ORDER BY p.created_at DESC
     LIMIT 30`,
    [volId, volId]
  );
  res.json(rows);
};

// GET /api/projects/:id
exports.getOne = async (req, res) => {
  const [rows] = await db.query(
    `SELECT p.*, o.id as org_id, o.name as org_name, o.avatar_url as org_avatar,
            o.description as org_description,
            GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ',') as tags,
            GROUP_CONCAT(DISTINCT t.color ORDER BY t.name SEPARATOR ',') as tag_colors,
            COUNT(DISTINCT pa.id) as accepted_count
     FROM projects p
     JOIN organizations o ON o.id=p.organization_id
     LEFT JOIN project_tags pt ON pt.project_id=p.id
     LEFT JOIN tags t ON t.id=pt.tag_id
     LEFT JOIN project_applications pa ON pa.project_id=p.id AND pa.status='accepted'
     WHERE p.id=? GROUP BY p.id`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Proyecto no encontrado' });
  res.json(rows[0]);
};

// GET /api/projects/organization/:orgId
exports.getByOrg = async (req, res) => {
  const [rows] = await db.query(
    `SELECT p.id, p.title, p.description, p.image_url, p.status, p.location,
            p.start_date, p.end_date, p.max_volunteers, p.created_at,
            GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ',') as tags,
            SUM(pa.status='accepted') as accepted_count,
            SUM(pa.status='pending') as pending_count
     FROM projects p
     LEFT JOIN project_tags pt ON pt.project_id=p.id
     LEFT JOIN tags t ON t.id=pt.tag_id
     LEFT JOIN project_applications pa ON pa.project_id=p.id
     WHERE p.organization_id=?
     GROUP BY p.id
     ORDER BY p.created_at DESC`,
    [req.params.orgId]
  );
  res.json(rows);
};

// POST /api/projects  — crear proyecto
exports.create = async (req, res) => {
  const { title, description, image_url, location, max_volunteers, start_date, end_date, tagIds } = req.body;
  if (!title || !description)
    return res.status(400).json({ error: 'Título y descripción son obligatorios' });

  const orgId = req.orgId; // set by planCheck middleware
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [pRes] = await conn.query(
      `INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, start_date, end_date)
       VALUES (?,?,?,?,?,?,?,?)`,
      [orgId, title, description, image_url || null, location || null,
       max_volunteers || null, start_date || null, end_date || null]
    );
    const projectId = pRes.insertId;

    if (Array.isArray(tagIds) && tagIds.length) {
      const tagRows = tagIds.map(t => [projectId, t]);
      await conn.query('INSERT IGNORE INTO project_tags (project_id, tag_id) VALUES ?', [tagRows]);
    }

    await conn.query(
      'UPDATE organizations SET projects_this_month=projects_this_month+1 WHERE id=?',
      [orgId]
    );

    await conn.commit();
    res.status(201).json({ message: 'Proyecto creado', projectId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al crear proyecto' });
  } finally {
    conn.release();
  }
};

// PUT /api/projects/:id  — editar proyecto
exports.update = async (req, res) => {
  const { title, description, image_url, location, max_volunteers, start_date, end_date, status, tagIds } = req.body;

  // Verify ownership
  const [pRow] = await db.query(
    'SELECT p.organization_id FROM projects p JOIN organizations o ON o.id=p.organization_id WHERE p.id=? AND o.user_id=?',
    [req.params.id, req.user.id]
  );
  if (!pRow.length) return res.status(403).json({ error: 'Acceso denegado' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      `UPDATE projects SET
       title=COALESCE(?,title), description=COALESCE(?,description),
       image_url=COALESCE(?,image_url), location=COALESCE(?,location),
       max_volunteers=COALESCE(?,max_volunteers), start_date=COALESCE(?,start_date),
       end_date=COALESCE(?,end_date), status=COALESCE(?,status)
       WHERE id=?`,
      [title, description, image_url, location, max_volunteers, start_date, end_date, status, req.params.id]
    );

    if (Array.isArray(tagIds)) {
      await conn.query('DELETE FROM project_tags WHERE project_id=?', [req.params.id]);
      if (tagIds.length) {
        const rows = tagIds.map(t => [req.params.id, t]);
        await conn.query('INSERT IGNORE INTO project_tags (project_id, tag_id) VALUES ?', [rows]);
      }
    }
    await conn.commit();
    res.json({ message: 'Proyecto actualizado' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: 'Error al actualizar' });
  } finally {
    conn.release();
  }
};

// PUT /api/projects/:id/complete  — marcar como completado (genera certificados)
exports.complete = async (req, res) => {
  const [pRow] = await db.query(
    'SELECT p.id, p.organization_id FROM projects p JOIN organizations o ON o.id=p.organization_id WHERE p.id=? AND o.user_id=?',
    [req.params.id, req.user.id]
  );
  if (!pRow.length) return res.status(403).json({ error: 'Acceso denegado' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query("UPDATE projects SET status='completed' WHERE id=?", [req.params.id]);

    // Obtener voluntarios aceptados
    const [volunteers] = await conn.query(
      `SELECT pa.volunteer_id, v.user_id FROM project_applications pa
       JOIN volunteers v ON v.id=pa.volunteer_id
       WHERE pa.project_id=? AND pa.status='accepted'`,
      [req.params.id]
    );

    // Generar certificados y notificaciones
    for (const vol of volunteers) {
      await conn.query(
        'INSERT IGNORE INTO certificates (volunteer_id, project_id) VALUES (?,?)',
        [vol.volunteer_id, req.params.id]
      );
      await conn.query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES (?, '¡Proyecto completado!',
         CONCAT('Has completado un proyecto. Tu certificado ya está disponible en tu perfil.'),
         'project_completed')`,
        [vol.user_id]
      );
    }

    await conn.commit();
    res.json({ message: 'Proyecto marcado como completado. Certificados generados.', count: volunteers.length });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al completar proyecto' });
  } finally {
    conn.release();
  }
};

// DELETE /api/projects/:id
exports.remove = async (req, res) => {
  const [pRow] = await db.query(
    'SELECT p.id FROM projects p JOIN organizations o ON o.id=p.organization_id WHERE p.id=? AND o.user_id=?',
    [req.params.id, req.user.id]
  );
  if (!pRow.length) return res.status(403).json({ error: 'Acceso denegado' });
  await db.query('DELETE FROM projects WHERE id=?', [req.params.id]);
  res.json({ message: 'Proyecto eliminado' });
};
