-- Seed data adapted for PostgreSQL
BEGIN;

-- 1) Voluntarios (10)
INSERT INTO users (email, password, role) VALUES
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

-- Insert volunteers linking by user email
INSERT INTO volunteers (user_id, name, last_name, bio, phone, city, birth_date)
SELECT u.id, 'Natalia','Gómez','Apasionada por la conservación ambiental.','+573001111111','Bucaramanga', DATE '1992-04-12' FROM users u WHERE u.email='v1@example.com' UNION ALL
SELECT u.id,'Carlos','Ramírez','Docente voluntario en educación popular.','+573002222222','Bucaramanga', DATE '1988-09-03' FROM users u WHERE u.email='v2@example.com' UNION ALL
SELECT u.id,'María','López','Diseñadora gráfica que colabora con ONGs.','+573003333333','Floridablanca', DATE '1995-07-21' FROM users u WHERE u.email='v3@example.com' UNION ALL
SELECT u.id,'Juan','Pérez','Programador interesado en tecnología social.','+573004444444','Bucaramanga', DATE '1990-01-10' FROM users u WHERE u.email='v4@example.com' UNION ALL
SELECT u.id,'Ana','Martínez','Líder comunitaria en proyectos de nutrición.','+573005555555','Bucaramanga', DATE '1985-12-30' FROM users u WHERE u.email='v5@example.com' UNION ALL
SELECT u.id,'Luis','Fernández','Estudiante universitario, trabaja en programas comunitarios.','+573006666666','Bucaramanga', DATE '2000-06-15' FROM users u WHERE u.email='v6@example.com' UNION ALL
SELECT u.id,'Sofía','Ruiz','Gestora cultural y voluntaria en arte.','+573007777777','Floridablanca', DATE '1993-11-02' FROM users u WHERE u.email='v7@example.com' UNION ALL
SELECT u.id,'Andrés','García','Deportista y promotor de bienestar.','+573008888888','Bucaramanga', DATE '1991-03-19' FROM users u WHERE u.email='v8@example.com' UNION ALL
SELECT u.id,'Laura','Rojas','Enfermera voluntaria en campañas de salud.','+573009999999','Bucaramanga', DATE '1987-08-25' FROM users u WHERE u.email='v9@example.com' UNION ALL
SELECT u.id,'Diego','Suárez','Emprendedor social en formación.','+573010000000','Bucaramanga', DATE '1994-02-14' FROM users u WHERE u.email='v10@example.com';
-- 2) Organizations (5)
INSERT INTO users (email, password, role) VALUES
('org1@example.com','$2a$12$...','organization'),
('org2@example.com','$2a$12$...','organization'),
('org3@example.com','$2a$12$...','organization'),
('org4@example.com','$2a$12$...','organization'),
('org5@example.com','$2a$12$...','organization');

INSERT INTO organizations (user_id, name, description, phone, address, city, website, plan_id, projects_this_month, month_reset_date)
SELECT u.id,'Guardianes del Río','Actividades de conservación y reforestación (medio ambiente).','+573011111111','Calle 100 #10-10','Bucaramanga','https://guardianesrio.org',1,1,current_date FROM users u WHERE u.email='org1@example.com';

INSERT INTO organizations (user_id, name, description, phone, address, city, website, plan_id, projects_this_month, month_reset_date)
SELECT u.id,'Abuelos en Casa','Programas de acompañamiento y cuidado para adultos mayores.','+573012222222','Carrera 15 #20-30','Bucaramanga','https://abuelosencasa.org',2,4,current_date FROM users u WHERE u.email='org2@example.com';

INSERT INTO organizations (user_id, name, description, phone, address, city, website, plan_id, projects_this_month, month_reset_date)
SELECT u.id,'Fiesta Social','Organización de eventos sociales y comunitarios.','+573013333333','Avenida 9 #33-21','Floridablanca','https://fiestasocial.org',3,6,current_date FROM users u WHERE u.email='org3@example.com';

INSERT INTO organizations (user_id, name, description, phone, address, city, website, plan_id, projects_this_month, month_reset_date)
SELECT u.id,'Refugio Peludo','Refugio y adopción para animales en situación de calle.','+573014444444','Diagonal 5 #11-50','Bucaramanga','https://refugiopeludo.org',4,8,current_date FROM users u WHERE u.email='org4@example.com';

INSERT INTO organizations (user_id, name, description, phone, address, city, website, plan_id, projects_this_month, month_reset_date)
SELECT u.id,'Cultura Viva','Proyectos culturales, talleres y festivales.','+573015555555','Calle 22 #44-10','Bucaramanga','https://culturaviva.org',3,5,current_date FROM users u WHERE u.email='org5@example.com';

-- 3) Projects by organization (use titles to reference later)
INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Limpieza Río Verde','Jornada de limpieza y reforestación en la cuenca del Río Verde.','', 'Parque Río Verde',20,'recruiting','2026-06-05',NULL FROM organizations o WHERE o.name='Guardianes del Río';

-- Org2 projects
INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Aula Intergeneracional 2026','Actividades educativas y recreativas enfocadas en adultos mayores y la comunidad (intergeneracional).','', 'Centro Comunitario',30,'completed','2026-01-10','2026-03-15' FROM organizations o WHERE o.name='Abuelos en Casa';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Biblioteca Comunitaria','Recolección y catalogación de libros.','', 'Centro Comunitario',10,'recruiting','2026-05-20',NULL FROM organizations o WHERE o.name='Abuelos en Casa';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Taller de Habilidades Digitales','Formación básica en uso de dispositivos y comunicación digital para adultos mayores.','', 'Centro Comunitario',12,'recruiting','2026-07-01',NULL FROM organizations o WHERE o.name='Abuelos en Casa';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Campaña Nutricional','Charlas y talleres de nutrición.','', 'Colegio San José',15,'completed','2025-11-01','2026-02-01' FROM organizations o WHERE o.name='Abuelos en Casa';

-- Org3 projects
INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Festival de Arte','Eventos y talleres para jóvenes artistas.','', 'Plaza Principal',25,'completed','2025-09-05','2025-12-10' FROM organizations o WHERE o.name='Fiesta Social';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Muestra Cultural','Exposición y actividades culturales.','', 'Casa de la Cultura',20,'recruiting','2026-08-01',NULL FROM organizations o WHERE o.name='Fiesta Social';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Residencia Artística','Programa de residencia para creadores.','', 'Talleres Arte Viva',6,'recruiting','2026-09-10',NULL FROM organizations o WHERE o.name='Fiesta Social';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Taller de Teatro','Formación teatral comunitaria.','', 'Teatro Local',18,'recruiting','2026-06-15',NULL FROM organizations o WHERE o.name='Fiesta Social';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Murales por la Paz','Intervenciones artísticas en espacios públicos.','', 'Barrios',10,'completed','2026-02-01','2026-04-01' FROM organizations o WHERE o.name='Fiesta Social';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Círculo de Lectura','Club de lectura y discusión.','', 'Biblioteca Arte Viva',12,'recruiting','2026-05-25',NULL FROM organizations o WHERE o.name='Fiesta Social';

-- Org4 projects (similar pattern)
INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Programa Emprende','Acompañamiento a emprendimientos sociales.','', 'Centro Empresarial',40,'completed','2025-06-01','2025-10-01' FROM organizations o WHERE o.name='Refugio Peludo';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Laboratorio de Innovación','Prototipado con comunidades.','', 'Lab Impulso',20,'recruiting','2026-06-20',NULL FROM organizations o WHERE o.name='Refugio Peludo';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Mentoría Profesional','Mentorías para jóvenes líderes.','', 'Oficinas',15,'completed','2026-01-15','2026-03-20' FROM organizations o WHERE o.name='Refugio Peludo';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Campaña de Salud','Jornadas de salud preventiva.','', 'Plaza Salud',30,'completed','2026-02-10','2026-04-10' FROM organizations o WHERE o.name='Refugio Peludo';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Foro Empresarial','Eventos y networking con impacto social.','', 'Auditorio',50,'recruiting','2026-09-05',NULL FROM organizations o WHERE o.name='Refugio Peludo';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Capacitación Técnica','Cursos técnicos para la comunidad.','', 'Centro de Formación',25,'recruiting','2026-07-01',NULL FROM organizations o WHERE o.name='Refugio Peludo';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Voluntariado Corporativo','Proyectos cortos con empleados.','', 'Sedes',60,'recruiting','2026-05-10',NULL FROM organizations o WHERE o.name='Refugio Peludo';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Evaluación de Impacto','Medición de proyectos sociales.','', 'Oficinas Centrales',8,'recruiting','2026-06-01',NULL FROM organizations o WHERE o.name='Refugio Peludo';

-- Org5 projects
INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Talleres Comunitarios','Series de talleres abiertos de música, danza y creación.','', 'Centro Cultural',20,'completed','2026-01-10','2026-03-01' FROM organizations o WHERE o.name='Cultura Viva';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Festival Callejero','Actividades artísticas al aire libre para toda la comunidad.','', 'Plaza Central',30,'recruiting','2026-09-10',NULL FROM organizations o WHERE o.name='Cultura Viva';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Residencia de Artistas','Alojamiento y apoyo a artistas emergentes.','', 'Casa de la Cultura',8,'recruiting','2026-07-15',NULL FROM organizations o WHERE o.name='Cultura Viva';

INSERT INTO projects (organization_id, title, description, image_url, location, max_volunteers, status, start_date, end_date)
SELECT o.id,'Ciclo de Conciertos','Conciertos comunitarios con artistas locales.','', 'Parque Cultural',40,'recruiting','2026-08-20',NULL FROM organizations o WHERE o.name='Cultura Viva';

-- 3.5) Avatares, banners, imágenes y etiquetas
-- Volunteers avatars and banners
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=1', banner_url='https://picsum.photos/seed/v1/1200/300' WHERE id = (SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v1@example.com' LIMIT 1);
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=2', banner_url='https://picsum.photos/seed/v2/1200/300' WHERE id = (SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v2@example.com' LIMIT 1);
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=3', banner_url='https://picsum.photos/seed/v3/1200/300' WHERE id = (SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v3@example.com' LIMIT 1);
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=4', banner_url='https://picsum.photos/seed/v4/1200/300' WHERE id = (SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v4@example.com' LIMIT 1);
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=5', banner_url='https://picsum.photos/seed/v5/1200/300' WHERE id = (SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v5@example.com' LIMIT 1);
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=6', banner_url='https://picsum.photos/seed/v6/1200/300' WHERE id = (SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v6@example.com' LIMIT 1);
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=7', banner_url='https://picsum.photos/seed/v7/1200/300' WHERE id = (SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v7@example.com' LIMIT 1);
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=8', banner_url='https://picsum.photos/seed/v8/1200/300' WHERE id = (SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v8@example.com' LIMIT 1);
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=9', banner_url='https://picsum.photos/seed/v9/1200/300' WHERE id = (SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v9@example.com' LIMIT 1);
UPDATE volunteers SET avatar_url='https://i.pravatar.cc/150?img=10', banner_url='https://picsum.photos/seed/v10/1200/300' WHERE id = (SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v10@example.com' LIMIT 1);

-- Organizations avatars/banners
UPDATE organizations SET avatar_url='https://picsum.photos/seed/org1/200/200', banner_url='https://picsum.photos/seed/org1b/1400/350' WHERE name='Guardianes del Río';
UPDATE organizations SET avatar_url='https://picsum.photos/seed/org2/200/200', banner_url='https://picsum.photos/seed/org2b/1400/350' WHERE name='Abuelos en Casa';
UPDATE organizations SET avatar_url='https://picsum.photos/seed/org3/200/200', banner_url='https://picsum.photos/seed/org3b/1400/350' WHERE name='Fiesta Social';
UPDATE organizations SET avatar_url='https://picsum.photos/seed/org4/200/200', banner_url='https://picsum.photos/seed/org4b/1400/350' WHERE name='Refugio Peludo';
UPDATE organizations SET avatar_url='https://picsum.photos/seed/org5/200/200', banner_url='https://picsum.photos/seed/org5b/1400/350' WHERE name='Cultura Viva';

-- Images for projects (use project title to find id)
UPDATE projects SET image_url='https://picsum.photos/seed/p_o1_1/800/500' WHERE title='Limpieza Río Verde';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o2_1/800/500' WHERE title='Aula Intergeneracional 2026';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o2_2/800/500' WHERE title='Biblioteca Comunitaria';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o2_3/800/500' WHERE title='Taller de Habilidades Digitales';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o2_4/800/500' WHERE title='Campaña Nutricional';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o3_1/800/500' WHERE title='Festival de Arte';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o3_2/800/500' WHERE title='Muestra Cultural';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o3_3/800/500' WHERE title='Residencia Artística';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o3_4/800/500' WHERE title='Taller de Teatro';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o3_5/800/500' WHERE title='Murales por la Paz';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o3_6/800/500' WHERE title='Círculo de Lectura';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o4_1/800/500' WHERE title='Programa Emprende';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o4_2/800/500' WHERE title='Laboratorio de Innovación';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o4_3/800/500' WHERE title='Mentoría Profesional';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o4_4/800/500' WHERE title='Campaña de Salud';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o4_5/800/500' WHERE title='Foro Empresarial';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o4_6/800/500' WHERE title='Capacitación Técnica';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o4_7/800/500' WHERE title='Voluntariado Corporativo';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o4_8/800/500' WHERE title='Evaluación de Impacto';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o5_1/800/500' WHERE title='Talleres Comunitarios';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o5_2/800/500' WHERE title='Festival Callejero';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o5_3/800/500' WHERE title='Residencia de Artistas';
UPDATE projects SET image_url='https://picsum.photos/seed/p_o5_4/800/500' WHERE title='Ciclo de Conciertos';

-- Volunteer tags (use email->volunteer mapping)
INSERT INTO volunteer_tags (volunteer_id, tag_id)
VALUES
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v1@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Ambiental' LIMIT 1)),
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v1@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Medio Ambiente' LIMIT 1)),
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v2@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Educación' LIMIT 1)),
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v2@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Emprendimiento' LIMIT 1)),
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v3@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Arte y Cultura' LIMIT 1)),
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v3@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Tecnología' LIMIT 1)),
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v4@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Tecnología' LIMIT 1)),
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v4@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Emprendimiento' LIMIT 1)),
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v5@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Nutrición' LIMIT 1)),
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v5@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Salud' LIMIT 1)),
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v6@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Deporte' LIMIT 1)),
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v6@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Causas Sociales' LIMIT 1)),
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v7@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Arte y Cultura' LIMIT 1)),
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v8@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Deporte' LIMIT 1)),
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v9@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Salud' LIMIT 1)),
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v10@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Emprendimiento' LIMIT 1)),
((SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v10@example.com' LIMIT 1),(SELECT id FROM tags WHERE name='Medio Ambiente' LIMIT 1));

-- Project tags (use project title)
INSERT INTO project_tags (project_id, tag_id)
VALUES
((SELECT id FROM projects WHERE title='Limpieza Río Verde' LIMIT 1),(SELECT id FROM tags WHERE name='Medio Ambiente' LIMIT 1)),
((SELECT id FROM projects WHERE title='Limpieza Río Verde' LIMIT 1),(SELECT id FROM tags WHERE name='Ambiental' LIMIT 1)),
((SELECT id FROM projects WHERE title='Aula Intergeneracional 2026' LIMIT 1),(SELECT id FROM tags WHERE name='Adulto Mayor' LIMIT 1)),
((SELECT id FROM projects WHERE title='Aula Intergeneracional 2026' LIMIT 1),(SELECT id FROM tags WHERE name='Causas Sociales' LIMIT 1)),
((SELECT id FROM projects WHERE title='Biblioteca Comunitaria' LIMIT 1),(SELECT id FROM tags WHERE name='Educación' LIMIT 1)),
((SELECT id FROM projects WHERE title='Biblioteca Comunitaria' LIMIT 1),(SELECT id FROM tags WHERE name='Causas Sociales' LIMIT 1)),
((SELECT id FROM projects WHERE title='Taller de Habilidades Digitales' LIMIT 1),(SELECT id FROM tags WHERE name='Tecnología' LIMIT 1)),
((SELECT id FROM projects WHERE title='Taller de Habilidades Digitales' LIMIT 1),(SELECT id FROM tags WHERE name='Adulto Mayor' LIMIT 1)),
((SELECT id FROM projects WHERE title='Campaña Nutricional' LIMIT 1),(SELECT id FROM tags WHERE name='Nutrición' LIMIT 1)),
((SELECT id FROM projects WHERE title='Campaña Nutricional' LIMIT 1),(SELECT id FROM tags WHERE name='Salud' LIMIT 1)),
((SELECT id FROM projects WHERE title='Festival de Arte' LIMIT 1),(SELECT id FROM tags WHERE name='Arte y Cultura' LIMIT 1)),
((SELECT id FROM projects WHERE title='Muestra Cultural' LIMIT 1),(SELECT id FROM tags WHERE name='Arte y Cultura' LIMIT 1)),
((SELECT id FROM projects WHERE title='Residencia Artística' LIMIT 1),(SELECT id FROM tags WHERE name='Arte y Cultura' LIMIT 1)),
((SELECT id FROM projects WHERE title='Taller de Teatro' LIMIT 1),(SELECT id FROM tags WHERE name='Arte y Cultura' LIMIT 1)),
((SELECT id FROM projects WHERE title='Murales por la Paz' LIMIT 1),(SELECT id FROM tags WHERE name='Arte y Cultura' LIMIT 1)),
((SELECT id FROM projects WHERE title='Círculo de Lectura' LIMIT 1),(SELECT id FROM tags WHERE name='Arte y Cultura' LIMIT 1)),
((SELECT id FROM projects WHERE title='Programa Emprende' LIMIT 1),(SELECT id FROM tags WHERE name='Emprendimiento' LIMIT 1)),
((SELECT id FROM projects WHERE title='Programa Emprende' LIMIT 1),(SELECT id FROM tags WHERE name='Causas Sociales' LIMIT 1)),
((SELECT id FROM projects WHERE title='Laboratorio de Innovación' LIMIT 1),(SELECT id FROM tags WHERE name='Emprendimiento' LIMIT 1)),
((SELECT id FROM projects WHERE title='Mentoría Profesional' LIMIT 1),(SELECT id FROM tags WHERE name='Emprendimiento' LIMIT 1)),
((SELECT id FROM projects WHERE title='Campaña de Salud' LIMIT 1),(SELECT id FROM tags WHERE name='Salud' LIMIT 1)),
((SELECT id FROM projects WHERE title='Foro Empresarial' LIMIT 1),(SELECT id FROM tags WHERE name='Emprendimiento' LIMIT 1)),
((SELECT id FROM projects WHERE title='Capacitación Técnica' LIMIT 1),(SELECT id FROM tags WHERE name='Emprendimiento' LIMIT 1)),
((SELECT id FROM projects WHERE title='Voluntariado Corporativo' LIMIT 1),(SELECT id FROM tags WHERE name='Emprendimiento' LIMIT 1)),
((SELECT id FROM projects WHERE title='Evaluación de Impacto' LIMIT 1),(SELECT id FROM tags WHERE name='Emprendimiento' LIMIT 1)),
((SELECT id FROM projects WHERE title='Talleres Comunitarios' LIMIT 1),(SELECT id FROM tags WHERE name='Arte y Cultura' LIMIT 1));

-- 4) Applications (examples)
INSERT INTO project_applications (project_id, volunteer_id, status, applied_at)
VALUES
((SELECT id FROM projects WHERE title='Aula Intergeneracional 2026' LIMIT 1),(SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v1@example.com' LIMIT 1),'accepted','2025-12-01 09:00:00'),
((SELECT id FROM projects WHERE title='Aula Intergeneracional 2026' LIMIT 1),(SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v2@example.com' LIMIT 1),'accepted','2026-01-05 11:20:00'),
((SELECT id FROM projects WHERE title='Festival de Arte' LIMIT 1),(SELECT v.id FROM volunteers v JOIN users u ON v.user_id=u.id WHERE u.email='v3@example.com' LIMIT 1),'accepted','2025-09-10 14:00:00');

-- 5) Generate certificates for accepted apps in completed projects
INSERT INTO certificates (volunteer_id, project_id, issued_at)
SELECT pa.volunteer_id, pa.project_id, GREATEST(COALESCE(p.end_date, now()), pa.applied_at)
FROM project_applications pa
JOIN projects p ON p.id = pa.project_id
WHERE pa.status = 'accepted' AND p.status = 'completed';

COMMIT;

-- To import on Render Postgres: create DB in Render, then from your machine:
-- psql "postgres://user:pass@host:port/dbname" -f voldigital_pg.sql
-- psql "postgres://user:pass@host:port/dbname" -f llenado_pg.sql
