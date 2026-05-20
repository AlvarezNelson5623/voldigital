const db = require('../config/db');

// Verifica que la org no haya superado su límite mensual de proyectos
const checkProjectLimit = async (req, res, next) => {
  const orgUserId = req.user.id;
  const [rows] = await db.query(
    `SELECT o.id, o.projects_this_month, o.month_reset_date, p.max_projects_monthly
     FROM organizations o
     JOIN plans p ON o.plan_id = p.id
     WHERE o.user_id = ?`, [orgUserId]
  );
  if (!rows.length) return res.status(404).json({ error: 'Organización no encontrada' });

  const org = rows[0];
  const now = new Date();
  const resetDate = new Date(org.month_reset_date);

  // Si pasó el mes, reiniciar contador
  if (now.getFullYear() > resetDate.getFullYear() ||
      now.getMonth() > resetDate.getMonth()) {
    await db.query(
      'UPDATE organizations SET projects_this_month=0, month_reset_date=? WHERE id=?',
      [now.toISOString().slice(0, 10), org.id]
    );
    org.projects_this_month = 0;
  }

  if (org.projects_this_month >= org.max_projects_monthly) {
    return res.status(403).json({
      error: `Límite de proyectos alcanzado para tu plan (${org.max_projects_monthly}/mes). Mejora tu plan para continuar.`
    });
  }

  req.orgId = org.id;
  next();
};

// Verifica que la org tenga acceso a una feature por plan
const requirePlanFeature = (feature) => async (req, res, next) => {
  const [rows] = await db.query(
    `SELECT p.${feature} FROM organizations o JOIN plans p ON o.plan_id=p.id WHERE o.user_id=?`,
    [req.user.id]
  );
  if (!rows.length || !rows[0][feature])
    return res.status(403).json({ error: 'Tu plan actual no incluye esta función' });
  next();
};

module.exports = { checkProjectLimit, requirePlanFeature };
