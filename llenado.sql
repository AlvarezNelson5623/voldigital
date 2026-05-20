USE `voldigital`;

START TRANSACTION;

/* ----------------------------- */
/* 1) Voluntarios (10)          */
/* ----------------------------- */
INSERT INTO `users` (email, password, role) VALUES
('v1@example.com','$2a$12$3ghbMLgOVa0X1uSwrhz7ZOr.7J7.6FXCEp40IHPLJOYDKhhjYnI7C','volunteer'),
('v2@example.com','$2a$12$3ghbMLgOVa0X1uSwrhz7ZOr.7J7.6FXCEp40IHPLJOYDKhhjYnI7C','volunteer'),
('v3@example.com','$2a$12$3ghbMLgOVa0X1uSwrhz7ZOr.7J7.6FXCEp40IHPLJOYDKhhjYnI7C','volunteer'),
('v4@example.com','$2a$12$3ghbMLgOVa0X1uSwrhz7ZOr.7J7.6FXCEp40IHPLJOYDKhhjYnI7C','volunteer'),
('v5@example.com','$2a$12$3ghbMLgOVa0X1uSwrhz7ZOr.7J7.6FXCEp40IHPLJOYDKhhjYnI7C','volunteer'),
('v6@example.com','$2a$12$3ghbMLgOVa0X1uSwrhz7ZOr.7J7.6FXCEp40IHPLJOYDKhhjYnI7C','volunteer'),
('v7@example.com','$2a$12$3ghbMLgOVa0X1uSwrhz7ZOr.7J7.6FXCEp40IHPLJOYDKhhjYnI7C','volunteer'),
('v8@example.com','$2a$12$3ghbMLgOVa0X1uSwrhz7ZOr.7J7.6FXCEp40IHPLJOYDKhhjYnI7C','volunteer'),
('v9@example.com','$2a$12$3ghbMLgOVa0X1uSwrhz7ZOr.7J7.6FXCEp40IHPLJOYDKhhjYnI7C','volunteer'),
('v10@example.com','$2a$12$3ghbMLgOVa0X1uSwrhz7ZOr.7J7.6FXCEp40IHPLJOYDKhhjYnI7C','volunteer');

SET @u1 = (SELECT id FROM users WHERE email='v1@example.com');
SET @u2 = (SELECT id FROM users WHERE email='v2@example.com');
SET @u3 = (SELECT id FROM users WHERE email='v3@example.com');
SET @u4 = (SELECT id FROM users WHERE email='v4@example.com');
SET @u5 = (SELECT id FROM users WHERE email='v5@example.com');
SET @u6 = (SELECT id FROM users WHERE email='v6@example.com');
SET @u7 = (SELECT id FROM users WHERE email='v7@example.com');
SET @u8 = (SELECT id FROM users WHERE email='v8@example.com');
SET @u9 = (SELECT id FROM users WHERE email='v9@example.com');
SET @u10 = (SELECT id FROM users WHERE email='v10@example.com');

INSERT INTO `volunteers` (user_id, name, last_name, bio, phone, city, birth_date)
VALUES
(@u1, 'Natalia', 'Gómez', 'Apasionada por la conservación ambiental.', '+573001111111','Bucaramanga','1992-04-12'),
(@u2, 'Carlos', 'Ramírez', 'Docente voluntario en educación popular.', '+573002222222','Bucaramanga','1988-09-03'),
(@u3, 'María', 'López', 'Diseñadora gráfica que colabora con ONGs.', '+573003333333','Floridablanca','1995-07-21'),
(@u4, 'Juan', 'Pérez', 'Programador interesado en tecnología social.', '+573004444444','Bucaramanga','1990-01-10'),
(@u5, 'Ana', 'Martínez', 'Líder comunitaria en proyectos de nutrición.', '+573005555555','Bucaramanga','1985-12-30'),
(@u6, 'Luis', 'Fernández', 'Estudiante universitario, trabaja en programas comunitarios.', '+573006666666','Bucaramanga','2000-06-15'),
(@u7, 'Sofía', 'Ruiz', 'Gestora cultural y voluntaria en arte.', '+573007777777','Floridablanca','1993-11-02'),
(@u8, 'Andrés', 'García', 'Deportista y promotor de bienestar.', '+573008888888','Bucaramanga','1991-03-19'),
(@u9, 'Laura', 'Rojas', 'Enfermera voluntaria en campañas de salud.', '+573009999999','Bucaramanga','1987-08-25'),
(@u10,'Diego', 'Suárez', 'Emprendedor social en formación.', '+573010000000','Bucaramanga','1994-02-14');

-- Variables con los IDs reales de la tabla `volunteers` (FK requiere volunteers.id)
SET @vol1 = (SELECT id FROM volunteers WHERE user_id=@u1 LIMIT 1);
SET @vol2 = (SELECT id FROM volunteers WHERE user_id=@u2 LIMIT 1);
SET @vol3 = (SELECT id FROM volunteers WHERE user_id=@u3 LIMIT 1);
SET @vol4 = (SELECT id FROM volunteers WHERE user_id=@u4 LIMIT 1);
SET @vol5 = (SELECT id FROM volunteers WHERE user_id=@u5 LIMIT 1);
SET @vol6 = (SELECT id FROM volunteers WHERE user_id=@u6 LIMIT 1);
SET @vol7 = (SELECT id FROM volunteers WHERE user_id=@u7 LIMIT 1);
SET @vol8 = (SELECT id FROM volunteers WHERE user_id=@u8 LIMIT 1);
SET @vol9 = (SELECT id FROM volunteers WHERE user_id=@u9 LIMIT 1);
SET @vol10 = (SELECT id FROM volunteers WHERE user_id=@u10 LIMIT 1);

/* ----------------------------- */
/* 2) Organizaciones (5)         */
/* Temáticas: medio ambiente, abuelitos, eventos sociales, refugio de animales, cultura */
/* Planes: 1=Gratis,2=Starter,3=Professional,4=Enterprise */
/* ----------------------------- */
INSERT INTO `users` (email, password, role) VALUES
('org1@example.com','$2a$12$3ghbMLgOVa0X1uSwrhz7ZOr.7J7.6FXCEp40IHPLJOYDKhhjYnI7C','organization'),
('org2@example.com','$2a$12$3ghbMLgOVa0X1uSwrhz7ZOr.7J7.6FXCEp40IHPLJOYDKhhjYnI7C','organization'),
('org3@example.com','$2a$12$3ghbMLgOVa0X1uSwrhz7ZOr.7J7.6FXCEp40IHPLJOYDKhhjYnI7C','organization'),
('org4@example.com','$2a$12$3ghbMLgOVa0X1uSwrhz7ZOr.7J7.6FXCEp40IHPLJOYDKhhjYnI7C','organization'),
('org5@example.com','$2a$12$3ghbMLgOVa0X1uSwrhz7ZOr.7J7.6FXCEp40IHPLJOYDKhhjYnI7C','organization');

SET @ou1 = (SELECT id FROM users WHERE email='org1@example.com');
SET @ou2 = (SELECT id FROM users WHERE email='org2@example.com');
SET @ou3 = (SELECT id FROM users WHERE email='org3@example.com');
SET @ou4 = (SELECT id FROM users WHERE email='org4@example.com');
SET @ou5 = (SELECT id FROM users WHERE email='org5@example.com');

INSERT INTO `organizations` (user_id, name, description, phone, address, city, website, plan_id, projects_this_month, month_reset_date)
VALUES
(@ou1, 'Guardianes del Río', 'Actividades de conservación y reforestación (medio ambiente).', '+573011111111','Calle 100 #10-10','Bucaramanga','https://guardianesrio.org', 1, 1, CURDATE()),
(@ou2, 'Abuelos en Casa', 'Programas de acompañamiento y cuidado para adultos mayores.', '+573012222222','Carrera 15 #20-30','Bucaramanga','https://abuelosencasa.org', 2, 4, CURDATE()),
(@ou3, 'Fiesta Social', 'Organización de eventos sociales y comunitarios.', '+573013333333','Avenida 9 #33-21','Floridablanca','https://fiestasocial.org', 3, 6, CURDATE()),
(@ou4, 'Refugio Peludo', 'Refugio y adopción para animales en situación de calle.', '+573014444444','Diagonal 5 #11-50','Bucaramanga','https://refugiopeludo.org', 4, 8, CURDATE()),
(@ou5, 'Cultura Viva', 'Proyectos culturales, talleres y festivales.', '+573015555555','Calle 22 #44-10','Bucaramanga','https://culturaviva.org', 3, 5, CURDATE());

SET @org1 = (SELECT id FROM organizations WHERE user_id=@ou1 LIMIT 1);
SET @org2 = (SELECT id FROM organizations WHERE user_id=@ou2 LIMIT 1);
SET @org3 = (SELECT id FROM organizations WHERE user_id=@ou3 LIMIT 1);
SET @org4 = (SELECT id FROM organizations WHERE user_id=@ou4 LIMIT 1);
SET @org5 = (SELECT id FROM organizations WHERE user_id=@ou5 LIMIT 1);

/* ----------------------------- */
/* 3) Proyectos por organización */
/* Respectando el máximo indicado en plans.max_projects_monthly (creamos <= max) */
/* Org1 (plan 1) -> 1 proyecto */
INSERT INTO `projects` (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
VALUES
(@org1, 'Limpieza Río Verde', 'Jornada de limpieza y reforestación en la cuenca del Río Verde.', '', 'Parque Río Verde', 20, 'recruiting', '2026-06-05', NULL);
SET @p_o1_1 = LAST_INSERT_ID();

/* Org2 (plan 2) -> 4 proyectos */
INSERT INTO `projects` (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
VALUES
(@org2, 'Aula Intergeneracional 2026', 'Actividades educativas y recreativas enfocadas en adultos mayores y la comunidad (intergeneracional).', '', 'Centro Comunitario', 30, 'completed', '2026-01-10', '2026-03-15'),
(@org2, 'Biblioteca Comunitaria', 'Recolección y catalogación de libros.', '', 'Centro Comunitario', 10, 'recruiting', '2026-05-20', NULL),
(@org2, 'Taller de Habilidades Digitales', 'Formación básica en uso de dispositivos y comunicación digital para adultos mayores.', '', 'Centro Comunitario', 12, 'recruiting', '2026-07-01', NULL),
(@org2, 'Campaña Nutricional', 'Charlas y talleres de nutrición.', '', 'Colegio San José', 15, 'completed', '2025-11-01', '2026-02-01');

SET @p_o2_1 = (SELECT id FROM projects WHERE organization_id=@org2 ORDER BY id LIMIT 1 OFFSET 0);
SET @p_o2_2 = (SELECT id FROM projects WHERE organization_id=@org2 ORDER BY id LIMIT 1 OFFSET 1);
SET @p_o2_3 = (SELECT id FROM projects WHERE organization_id=@org2 ORDER BY id LIMIT 1 OFFSET 2);
SET @p_o2_4 = (SELECT id FROM projects WHERE organization_id=@org2 ORDER BY id LIMIT 1 OFFSET 3);

/* Org3 (plan 3) -> 6 proyectos */
INSERT INTO `projects` (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
VALUES
(@org3, 'Festival de Arte', 'Eventos y talleres para jóvenes artistas.', '', 'Plaza Principal', 25, 'completed', '2025-09-05', '2025-12-10'),
(@org3, 'Muestra Cultural', 'Exposición y actividades culturales.', '', 'Casa de la Cultura', 20, 'recruiting', '2026-08-01', NULL),
(@org3, 'Residencia Artística', 'Programa de residencia para creadores.', '', 'Talleres Arte Viva', 6, 'recruiting', '2026-09-10', NULL),
(@org3, 'Taller de Teatro', 'Formación teatral comunitaria.', '', 'Teatro Local', 18, 'recruiting', '2026-06-15', NULL),
(@org3, 'Murales por la Paz', 'Intervenciones artísticas en espacios públicos.', '', 'Barrios', 10, 'completed', '2026-02-01', '2026-04-01'),
(@org3, 'Círculo de Lectura', 'Club de lectura y discusión.', '', 'Biblioteca Arte Viva', 12, 'recruiting', '2026-05-25', NULL);

SET @p_o3_1 = (SELECT id FROM projects WHERE organization_id=@org3 ORDER BY id LIMIT 1 OFFSET 0);
SET @p_o3_2 = (SELECT id FROM projects WHERE organization_id=@org3 ORDER BY id LIMIT 1 OFFSET 1);
SET @p_o3_3 = (SELECT id FROM projects WHERE organization_id=@org3 ORDER BY id LIMIT 1 OFFSET 2);
SET @p_o3_4 = (SELECT id FROM projects WHERE organization_id=@org3 ORDER BY id LIMIT 1 OFFSET 3);
SET @p_o3_5 = (SELECT id FROM projects WHERE organization_id=@org3 ORDER BY id LIMIT 1 OFFSET 4);
SET @p_o3_6 = (SELECT id FROM projects WHERE organization_id=@org3 ORDER BY id LIMIT 1 OFFSET 5);

/* Org4 (plan 4) -> 8 proyectos */
INSERT INTO `projects` (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
VALUES
(@org4, 'Programa Emprende', 'Acompañamiento a emprendimientos sociales.', '', 'Centro Empresarial', 40, 'completed', '2025-06-01', '2025-10-01'),
(@org4, 'Laboratorio de Innovación', 'Prototipado con comunidades.', '', 'Lab Impulso', 20, 'recruiting', '2026-06-20', NULL),
(@org4, 'Mentoría Profesional', 'Mentorías para jóvenes líderes.', '', 'Oficinas', 15, 'completed', '2026-01-15', '2026-03-20'),
(@org4, 'Campaña de Salud', 'Jornadas de salud preventiva.', '', 'Plaza Salud', 30, 'completed', '2026-02-10', '2026-04-10'),
(@org4, 'Foro Empresarial', 'Eventos y networking con impacto social.', '', 'Auditorio', 50, 'recruiting', '2026-09-05', NULL),
(@org4, 'Capacitación Técnica', 'Cursos técnicos para la comunidad.', '', 'Centro de Formación', 25, 'recruiting', '2026-07-01', NULL),
(@org4, 'Voluntariado Corporativo', 'Proyectos cortos con empleados.', '', 'Sedes', 60, 'recruiting', '2026-05-10', NULL),
(@org4, 'Evaluación de Impacto', 'Medición de proyectos sociales.', '', 'Oficinas Centrales', 8, 'recruiting', '2026-06-01', NULL);

SET @p_o4_1 = (SELECT id FROM projects WHERE organization_id=@org4 ORDER BY id LIMIT 1 OFFSET 0);
SET @p_o4_2 = (SELECT id FROM projects WHERE organization_id=@org4 ORDER BY id LIMIT 1 OFFSET 1);
SET @p_o4_3 = (SELECT id FROM projects WHERE organization_id=@org4 ORDER BY id LIMIT 1 OFFSET 2);
SET @p_o4_4 = (SELECT id FROM projects WHERE organization_id=@org4 ORDER BY id LIMIT 1 OFFSET 3);
SET @p_o4_5 = (SELECT id FROM projects WHERE organization_id=@org4 ORDER BY id LIMIT 1 OFFSET 4);
SET @p_o4_6 = (SELECT id FROM projects WHERE organization_id=@org4 ORDER BY id LIMIT 1 OFFSET 5);
SET @p_o4_7 = (SELECT id FROM projects WHERE organization_id=@org4 ORDER BY id LIMIT 1 OFFSET 6);
SET @p_o4_8 = (SELECT id FROM projects WHERE organization_id=@org4 ORDER BY id LIMIT 1 OFFSET 7);

/* Org5 (Cultura Viva) -> 4 proyectos */
INSERT INTO `projects` (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
VALUES
(@org5, 'Talleres Comunitarios', 'Series de talleres abiertos de música, danza y creación.', '', 'Centro Cultural', 20, 'completed', '2026-01-10', '2026-03-01'),
(@org5, 'Festival Callejero', 'Actividades artísticas al aire libre para toda la comunidad.', '', 'Plaza Central', 30, 'recruiting', '2026-09-10', NULL),
(@org5, 'Residencia de Artistas', 'Alojamiento y apoyo a artistas emergentes.', '', 'Casa de la Cultura', 8, 'recruiting', '2026-07-15', NULL),
(@org5, 'Ciclo de Conciertos', 'Conciertos comunitarios con artistas locales.', '', 'Parque Cultural', 40, 'recruiting', '2026-08-20', NULL);

SET @p_o5_1 = (SELECT id FROM projects WHERE organization_id=@org5 ORDER BY id LIMIT 1 OFFSET 0);
SET @p_o5_2 = (SELECT id FROM projects WHERE organization_id=@org5 ORDER BY id LIMIT 1 OFFSET 1);
SET @p_o5_3 = (SELECT id FROM projects WHERE organization_id=@org5 ORDER BY id LIMIT 1 OFFSET 2);
SET @p_o5_4 = (SELECT id FROM projects WHERE organization_id=@org5 ORDER BY id LIMIT 1 OFFSET 3);

/* ----------------------------- */
/* 3.5) Avatares, banners, imágenes y etiquetas */
/* Asignamos avatar_url y banner_url a voluntarios y organizaciones
	y image_url a proyectos. Luego insertamos etiquetas en volunteer_tags y project_tags.
*/

-- Avatares y banners para volunteers
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=1', banner_url='https://picsum.photos/seed/v1/1200/300' WHERE id=@vol1;
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=2', banner_url='https://picsum.photos/seed/v2/1200/300' WHERE id=@vol2;
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=3', banner_url='https://picsum.photos/seed/v3/1200/300' WHERE id=@vol3;
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=4', banner_url='https://picsum.photos/seed/v4/1200/300' WHERE id=@vol4;
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=5', banner_url='https://picsum.photos/seed/v5/1200/300' WHERE id=@vol5;
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=6', banner_url='https://picsum.photos/seed/v6/1200/300' WHERE id=@vol6;
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=7', banner_url='https://picsum.photos/seed/v7/1200/300' WHERE id=@vol7;
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=8', banner_url='https://picsum.photos/seed/v8/1200/300' WHERE id=@vol8;
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=9', banner_url='https://picsum.photos/seed/v9/1200/300' WHERE id=@vol9;
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=10', banner_url='https://picsum.photos/seed/v10/1200/300' WHERE id=@vol10;

-- Avatares y banners para organizaciones
UPDATE organizations SET avatar_url='https://picsum.photos/seed/org1/200/200', banner_url='https://picsum.photos/seed/org1b/1400/350' WHERE id=@org1;
UPDATE organizations SET avatar_url='https://picsum.photos/seed/org2/200/200', banner_url='https://picsum.photos/seed/org2b/1400/350' WHERE id=@org2;
UPDATE organizations SET avatar_url='https://picsum.photos/seed/org3/200/200', banner_url='https://picsum.photos/seed/org3b/1400/350' WHERE id=@org3;
UPDATE organizations SET avatar_url='https://picsum.photos/seed/org4/200/200', banner_url='https://picsum.photos/seed/org4b/1400/350' WHERE id=@org4;
UPDATE organizations SET avatar_url='https://picsum.photos/seed/org5/200/200', banner_url='https://picsum.photos/seed/org5b/1400/350' WHERE id=@org5;

-- Imágenes para proyectos (usar variables @p_oX_Y definidas arriba)
UPDATE projects SET image_url='https://picsum.photos/seed/p_o1_1/800/500' WHERE id=@p_o1_1;

UPDATE projects SET image_url='https://picsum.photos/seed/p_o2_1/800/500' WHERE id=@p_o2_1;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o2_2/800/500' WHERE id=@p_o2_2;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o2_3/800/500' WHERE id=@p_o2_3;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o2_4/800/500' WHERE id=@p_o2_4;

UPDATE projects SET image_url='https://picsum.photos/seed/p_o3_1/800/500' WHERE id=@p_o3_1;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o3_2/800/500' WHERE id=@p_o3_2;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o3_3/800/500' WHERE id=@p_o3_3;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o3_4/800/500' WHERE id=@p_o3_4;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o3_5/800/500' WHERE id=@p_o3_5;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o3_6/800/500' WHERE id=@p_o3_6;

UPDATE projects SET image_url='https://picsum.photos/seed/p_o4_1/800/500' WHERE id=@p_o4_1;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o4_2/800/500' WHERE id=@p_o4_2;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o4_3/800/500' WHERE id=@p_o4_3;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o4_4/800/500' WHERE id=@p_o4_4;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o4_5/800/500' WHERE id=@p_o4_5;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o4_6/800/500' WHERE id=@p_o4_6;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o4_7/800/500' WHERE id=@p_o4_7;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o4_8/800/500' WHERE id=@p_o4_8;

UPDATE projects SET image_url='https://picsum.photos/seed/p_o5_1/800/500' WHERE id=@p_o5_1;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o5_2/800/500' WHERE id=@p_o5_2;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o5_3/800/500' WHERE id=@p_o5_3;
UPDATE projects SET image_url='https://picsum.photos/seed/p_o5_4/800/500' WHERE id=@p_o5_4;

-- Etiquetas para volunteers (tag IDs según voldigital.sql)
INSERT INTO volunteer_tags (volunteer_id, tag_id) VALUES
(@vol1, 2), -- Ambiental
(@vol1, 14),
(@vol2, 4), -- Educación
(@vol2, 15), -- Emprendimiento
(@vol3, 7), -- Arte y Cultura
(@vol3, 6), -- Tecnología
(@vol4, 6),
(@vol4, 15),
(@vol5, 9), -- Nutrición
(@vol5, 5), -- Salud
(@vol6, 8), -- Deporte
(@vol6, 3), -- Causas Sociales
(@vol7, 7),
(@vol8, 8),
(@vol9, 5),
(@vol10, 15),
(@vol10, 14);

-- Etiquetas para projects
INSERT INTO project_tags (project_id, tag_id) VALUES
(@p_o1_1, 14), -- Limpieza Río Verde -> Medio Ambiente
(@p_o1_1, 2),

(@p_o2_1, 12), -- Aula Intergeneracional -> Adulto Mayor
(@p_o2_1, 3),
(@p_o2_2, 4), -- Biblioteca Comunitaria -> Educación
(@p_o2_2, 3),
(@p_o2_3, 6), -- Taller Habilidades Digitales -> Tecnología
(@p_o2_3, 12),
(@p_o2_4, 9), -- Campaña Nutricional -> Nutrición
(@p_o2_4, 5),

(@p_o3_1, 7), -- Festival de Arte
(@p_o3_2, 7),
(@p_o3_3, 7),
(@p_o3_4, 7),
(@p_o3_5, 7),
(@p_o3_6, 7),

(@p_o4_1, 15), -- Org4 proyectos -> Emprendimiento / Causas Sociales
(@p_o4_1, 3),
(@p_o4_2, 15),
(@p_o4_3, 15),
(@p_o4_4, 5),
(@p_o4_5, 15),
(@p_o4_6, 15),
(@p_o4_7, 15),
(@p_o4_8, 15),

(@p_o5_1, 7), -- Cultura Viva -> Arte y Cultura
(@p_o5_2, 7),
(@p_o5_3, 7),
(@p_o5_4, 7);


/* ----------------------------- */
/* 4) Postulaciones: varios voluntarios aplican en diferentes fechas */
/* Incluye aceptaciones, rechazos y pendientes. Algunos aceptados recibirán certificados (para proyectos completados). */
/* Ejemplo de aplicaciones para proyectos completados y no completados */

-- Aplicaciones a proyectos completados (para generar certificados)
INSERT INTO project_applications (project_id, volunteer_id, status, applied_at) VALUES
(@p_o2_1, @vol1, 'accepted', '2025-12-01 09:00:00'),
(@p_o2_1, @vol2, 'accepted', '2026-01-05 11:20:00'),
(@p_o3_1, @vol3, 'accepted', '2025-09-10 14:00:00'),
(@p_o3_5, @vol5, 'accepted', '2026-02-05 10:00:00'),
(@p_o4_1, @vol6, 'accepted', '2025-07-01 09:30:00'),
(@p_o4_3, @vol7, 'accepted', '2026-01-20 16:00:00'),
(@p_o4_4, @vol8, 'accepted', '2026-02-15 08:45:00'),
(@p_o5_1, @vol2, 'accepted', '2026-02-20 10:00:00'),
(@p_o5_1, @vol7, 'accepted', '2026-02-25 11:00:00');

-- Aplicaciones a proyectos recruitings (pendientes / aceptadas / rechazadas)
INSERT INTO project_applications (project_id, volunteer_id, status, applied_at) VALUES
(@p_o1_1, @vol4, 'pending', '2026-05-10 12:00:00'),
(@p_o2_2, @vol1, 'pending', '2026-05-12 09:30:00'),
(@p_o2_2, @vol9, 'accepted', '2026-05-13 10:15:00'),
(@p_o2_3, @vol10, 'rejected', '2026-05-14 11:00:00'),
(@p_o3_2, @vol2, 'pending', '2026-05-16 12:30:00'),
(@p_o3_3, @vol7, 'accepted', '2026-05-05 15:00:00'),
(@p_o3_6, @vol8, 'pending', '2026-05-18 09:00:00'),
(@p_o4_2, @vol4, 'pending', '2026-05-09 10:00:00'),
(@p_o4_5, @vol5, 'accepted', '2026-05-11 14:30:00'),
(@p_o4_6, @vol3, 'rejected', '2026-05-08 13:45:00'),
(@p_o5_2, @vol3, 'pending', '2026-06-01 10:00:00'),
(@p_o5_3, @vol1, 'pending', '2026-06-02 12:00:00');

/* Poco rechazo intencional: solo unas pocas filas con 'rejected' */

/* ----------------------------- */
/* 5) Generar certificados para voluntarios aceptados en proyectos completados */
/* Buscamos las aplicaciones 'accepted' que pertenezcan a proyectos con status='completed' */
INSERT INTO certificates (volunteer_id, project_id, issued_at)
SELECT pa.volunteer_id, pa.project_id, GREATEST(COALESCE(p.end_date, NOW()), pa.applied_at)
FROM project_applications pa
JOIN projects p ON p.id = pa.project_id
WHERE pa.status = 'accepted' AND p.status = 'completed';

COMMIT;

-- Nota: si deseas modificar contraseñas a hashes, reemplaza los valores en la tabla `users`.
-- Importa este archivo en phpMyAdmin o ejecuta: mysql -u root -p voldigital < llenado.sql
