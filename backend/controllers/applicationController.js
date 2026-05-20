const db = require('../config/db');

// POST /api/applications  — voluntario se postula
exports.apply = async (req, res) => {
  const { project_id } = req.body;
  if (!project_id) return res.status(400).json({ error: 'project_id requerido' });

  const [v] = await db.query('SELECT id FROM volunteers WHERE user_id=?', [req.user.id]);
  if (!v.length) return res.status(404).json({ error: 'Perfil voluntario no encontrado' });
  const volId = v[0].id;

  const [proj] = await db.query("SELECT id, status FROM projects WHERE id=?", [project_id]);
  if (!proj.length) return res.status(404).json({ error: 'Proyecto no encontrado' });
  if (!['recruiting','active'].includes(proj[0].status))
    return res.status(400).json({ error: 'El proyecto no está aceptando postulaciones' });

  try {
    await db.query(
      'INSERT INTO project_applications (project_id, volunteer_id) VALUES (?,?)',
      [project_id, volId]
    );

    // Notificar a la organización
    const [org] = await db.query(
      `SELECT o.user_id, p.title FROM projects p
       JOIN organizations o ON o.id=p.organization_id WHERE p.id=?`,
      [project_id]
    );
    if (org.length) {
      const volName = await db.query(
        'SELECT CONCAT(name," ",last_name) as full_name FROM volunteers WHERE id=?', [volId]
      );
      const fullName = volName[0]?.[0]?.full_name || 'Un voluntario';
      await db.query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES (?,?,?,?)`,
        [org[0].user_id,
         'Nueva postulación',
         `${fullName} se ha postulado al proyecto "${org[0].title}"`,
         'new_application']
      );
    }

    res.status(201).json({ message: 'Postulación enviada exitosamente' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Ya te has postulado a este proyecto' });
    res.status(500).json({ error: 'Error al postular' });
  }
};

// GET /api/applications/project/:projectId  — org ve postulaciones de su proyecto
exports.getByProject = async (req, res) => {
  const [pRow] = await db.query(
    'SELECT p.id FROM projects p JOIN organizations o ON o.id=p.organization_id WHERE p.id=? AND o.user_id=?',
    [req.params.projectId, req.user.id]
  );
  if (!pRow.length) return res.status(403).json({ error: 'Acceso denegado' });

  const [rows] = await db.query(
        `SELECT pa.id, pa.status, pa.applied_at,
          v.id as volunteer_id, v.name, v.last_name, v.bio, v.city, v.avatar_url, v.phone,
            GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ',') as tags
     FROM project_applications pa
     JOIN volunteers v ON v.id=pa.volunteer_id
     LEFT JOIN volunteer_tags vt ON vt.volunteer_id=v.id
     LEFT JOIN tags t ON t.id=vt.tag_id
     WHERE pa.project_id=?
     GROUP BY pa.id
     ORDER BY pa.applied_at DESC`,
    [req.params.projectId]
  );
  res.json(rows);
};

// GET /api/applications/volunteer/:volunteerId  — voluntario ve sus postulaciones
exports.getByVolunteer = async (req, res) => {
  const [u] = await db.query('SELECT user_id FROM volunteers WHERE id=?', [req.params.volunteerId]);
  if (!u.length || u[0].user_id !== req.user.id)
    return res.status(403).json({ error: 'Acceso denegado' });

  const [rows] = await db.query(
    `SELECT pa.id, pa.status, pa.applied_at,
            p.id as project_id, p.title, p.image_url, p.status as project_status,
            o.name as org_name
     FROM project_applications pa
     JOIN projects p ON p.id=pa.project_id
     JOIN organizations o ON o.id=p.organization_id
     WHERE pa.volunteer_id=?
     ORDER BY pa.applied_at DESC`,
    [req.params.volunteerId]
  );
  res.json(rows);
};

// PUT /api/applications/:id  — org acepta o rechaza
exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!['accepted','rejected'].includes(status))
    return res.status(400).json({ error: 'status debe ser accepted o rejected' });

  // Verificar que la org es dueña del proyecto de esta postulación
  const [appRow] = await db.query(
    `SELECT pa.id, pa.volunteer_id, v.user_id as vol_user_id,
            p.title as project_title
     FROM project_applications pa
     JOIN projects p ON p.id=pa.project_id
     JOIN organizations o ON o.id=p.organization_id
     JOIN volunteers v ON v.id=pa.volunteer_id
     WHERE pa.id=? AND o.user_id=?`,
    [req.params.id, req.user.id]
  );
  if (!appRow.length) return res.status(403).json({ error: 'Acceso denegado' });

  await db.query(
    'UPDATE project_applications SET status=?, updated_at=NOW() WHERE id=?',
    [status, req.params.id]
  );

  const app = appRow[0];
  const msg = status === 'accepted'
    ? `¡Tu postulación al proyecto "${app.project_title}" fue aceptada! Bienvenido al equipo.`
    : `Tu postulación al proyecto "${app.project_title}" no fue seleccionada esta vez.`;

  await db.query(
    'INSERT INTO notifications (user_id, title, message, type) VALUES (?,?,?,?)',
    [app.vol_user_id,
     status === 'accepted' ? '¡Postulación aceptada!' : 'Postulación no seleccionada',
     msg,
     status === 'accepted' ? 'application_accepted' : 'application_rejected']
  );

  res.json({ message: `Postulación ${status === 'accepted' ? 'aceptada' : 'rechazada'}` });
};
