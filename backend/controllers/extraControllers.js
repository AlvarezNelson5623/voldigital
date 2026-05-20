// ============================================================
//  certificateController.js
// ============================================================
const db = require('../config/db');

exports.getByVolunteer = async (req, res) => {
  const [u] = await db.query('SELECT user_id FROM volunteers WHERE id=?', [req.params.volunteerId]);
  if (!u.length || u[0].user_id !== req.user.id)
    return res.status(403).json({ error: 'Acceso denegado' });

  const [rows] = await db.query(
    `SELECT c.id, c.issued_at, c.download_paid,
            p.id as project_id, p.title as project_title,
            p.start_date, p.end_date, p.image_url as project_image,
            o.name as org_name, o.avatar_url as org_avatar,
            v.name as vol_name, v.last_name as vol_last_name
     FROM certificates c
     JOIN projects p ON p.id=c.project_id
     JOIN organizations o ON o.id=p.organization_id
     JOIN volunteers v ON v.id=c.volunteer_id
     WHERE c.volunteer_id=?
     ORDER BY c.issued_at DESC`,
    [req.params.volunteerId]
  );
  res.json(rows);
};

// POST /api/certificates/:id/pay  — simular pago $10.000 para descargar
exports.payDownload = async (req, res) => {
  const [cert] = await db.query(
    `SELECT c.id, c.volunteer_id, v.user_id FROM certificates c
     JOIN volunteers v ON v.id=c.volunteer_id WHERE c.id=?`,
    [req.params.id]
  );
  if (!cert.length) return res.status(404).json({ error: 'Certificado no encontrado' });
  if (cert[0].user_id !== req.user.id) return res.status(403).json({ error: 'Acceso denegado' });

  await db.query('UPDATE certificates SET download_paid=1 WHERE id=?', [req.params.id]);
  res.json({ message: 'Pago simulado exitoso. Ya puedes descargar tu certificado.' });
};

// ============================================================
//  notificationController.js
// ============================================================
exports.getNotifications = async (req, res) => {
  const [rows] = await db.query(
    `SELECT id, title, message, type, read_status, created_at
     FROM notifications WHERE user_id=?
     ORDER BY created_at DESC LIMIT 50`,
    [req.user.id]
  );
  const unread = rows.filter(n => !n.read_status).length;
  res.json({ notifications: rows, unread });
};

exports.markRead = async (req, res) => {
  await db.query('UPDATE notifications SET read_status=1 WHERE id=? AND user_id=?',
    [req.params.id, req.user.id]);
  res.json({ message: 'Marcada como leída' });
};

exports.markAllRead = async (req, res) => {
  await db.query('UPDATE notifications SET read_status=1 WHERE user_id=?', [req.user.id]);
  res.json({ message: 'Todas marcadas como leídas' });
};

// ============================================================
//  tagController.js
// ============================================================
exports.getTags = async (req, res) => {
  const [rows] = await db.query('SELECT id, name, category, color FROM tags ORDER BY category, name');
  res.json(rows);
};

// ============================================================
//  planController.js
// ============================================================
exports.getPlans = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM plans ORDER BY id');
  res.json(rows);
};

exports.upgrade = async (req, res) => {
  const { planId } = req.body;
  if (![1,2,3,4].includes(Number(planId)))
    return res.status(400).json({ error: 'Plan inválido' });

  const [org] = await db.query('SELECT id, plan_id FROM organizations WHERE user_id=?', [req.user.id]);
  if (!org.length) return res.status(404).json({ error: 'Organización no encontrada' });

  if (org[0].plan_id >= planId)
    return res.status(400).json({ error: 'Solo puedes mejorar tu plan actual' });

  await db.query('UPDATE organizations SET plan_id=? WHERE id=?', [planId, org[0].id]);
  const [plan] = await db.query('SELECT * FROM plans WHERE id=?', [planId]);
  res.json({ message: `Plan actualizado a ${plan[0].name}`, plan: plan[0] });
};

// ============================================================
//  advertisementController.js
// ============================================================
// GET /api/advertisements/active  — para el home público
exports.getActive = async (req, res) => {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const [rows] = await db.query(
    `SELECT a.id, a.image_url, a.title, a.link_url, o.name as org_name, o.avatar_url
     FROM advertisements a
     JOIN organizations o ON o.id=a.organization_id
     WHERE a.active=1 AND a.end_date > ?
     ORDER BY a.start_date DESC`,
    [now]
  );
  res.json(rows);
};

// POST /api/advertisements  — crear anuncio (enterprise)
exports.create = async (req, res) => {
  const { image_url, title, link_url, slot_number } = req.body;
  if (!image_url) return res.status(400).json({ error: 'image_url requerida' });

  const [org] = await db.query(
    `SELECT o.id FROM organizations o JOIN plans p ON o.plan_id=p.id
     WHERE o.user_id=? AND p.has_ads=1`,
    [req.user.id]
  );
  if (!org.length) return res.status(403).json({ error: 'Tu plan no incluye publicidad' });
  const orgId = org[0].id;

  // Verificar publicaciones en las últimas 5 días (máximo 2)
  const [recent] = await db.query(
    'SELECT COUNT(*) as cnt FROM advertisements WHERE organization_id=? AND start_date > DATE_SUB(NOW(), INTERVAL 5 DAY)',
    [orgId]
  );
  if (recent[0].cnt >= 2)
    return res.status(400).json({ error: 'Has alcanzado el límite de 2 publicaciones en los últimos 5 días.' });

  const endDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    .toISOString().slice(0, 19).replace('T', ' ');

  await db.query(
    'INSERT INTO advertisements (organization_id, image_url, title, link_url, slot_number, end_date) VALUES (?,?,?,?,?,?)',
    [orgId, image_url, title || null, link_url || null, slot_number || 1, endDate]
  );
  res.status(201).json({ message: 'Anuncio creado. Durará 5 días.' });
};

// PUT /api/advertisements/:id  — editar anuncio (solo dentro de 10 minutos desde publicación)
exports.updateAdvertisement = async (req, res) => {
  const id = req.params.id
  const { image_url, title, link_url } = req.body
  const [ad] = await db.query('SELECT organization_id, start_date FROM advertisements WHERE id=?', [id])
  if (!ad.length) return res.status(404).json({ error: 'Anuncio no encontrado' })

  const [org] = await db.query('SELECT id FROM organizations WHERE user_id=?', [req.user.id])
  if (!org.length || ad[0].organization_id !== org[0].id)
    return res.status(403).json({ error: 'Acceso denegado' })

  // Verificar ventana de edición: 10 minutos desde start_date
  const [canEdit] = await db.query('SELECT IF(NOW() <= DATE_ADD(start_date, INTERVAL 10 MINUTE),1,0) as allowed FROM advertisements WHERE id=?', [id])
  if (!canEdit.length || canEdit[0].allowed !== 1)
    return res.status(400).json({ error: 'La ventana de edición (10 minutos) ya expiró' })

  await db.query('UPDATE advertisements SET image_url=?, title=?, link_url=? WHERE id=?', [image_url || null, title || null, link_url || null, id])
  res.json({ message: 'Anuncio actualizado' })
}

// DELETE /api/advertisements/:id — eliminar/terminar anuncio antes de su fin (contará como publicación)
exports.deleteAdvertisement = async (req, res) => {
  const id = req.params.id
  const [ad] = await db.query('SELECT organization_id FROM advertisements WHERE id=?', [id])
  if (!ad.length) return res.status(404).json({ error: 'Anuncio no encontrado' })

  const [org] = await db.query('SELECT id FROM organizations WHERE user_id=?', [req.user.id])
  if (!org.length || ad[0].organization_id !== org[0].id)
    return res.status(403).json({ error: 'Acceso denegado' })

  // Mark as inactive and set end_date to now — keeps start_date so it still counts within 5-day window
  await db.query('UPDATE advertisements SET active=0, end_date=NOW() WHERE id=?', [id])
  res.json({ message: 'Anuncio eliminado' })
}

// GET /api/advertisements/organization/:orgId
exports.getByOrg = async (req, res) => {
  const [u] = await db.query('SELECT user_id FROM organizations WHERE id=?', [req.params.orgId]);
  if (!u.length || u[0].user_id !== req.user.id)
    return res.status(403).json({ error: 'Acceso denegado' });

  const [rows] = await db.query(
    `SELECT a.*, IF(a.end_date > NOW() AND a.active=1, 1, 0) as is_active,
            GREATEST(0, TIMESTAMPDIFF(SECOND, NOW(), DATE_ADD(a.start_date, INTERVAL 10 MINUTE))) as edit_seconds
     FROM advertisements a WHERE a.organization_id=? ORDER BY a.start_date DESC`,
    [req.params.orgId]
  );
  res.json(rows);
};
