-- VolDigital PostgreSQL schema
-- Adapted from MySQL to PostgreSQL

BEGIN;

-- Plans
CREATE TABLE plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price INT NOT NULL DEFAULT 0,
  max_projects_monthly INT NOT NULL DEFAULT 1,
  can_view_volunteers BOOLEAN NOT NULL DEFAULT false,
  has_dashboard BOOLEAN NOT NULL DEFAULT false,
  has_ads BOOLEAN NOT NULL DEFAULT false,
  ad_slots INT NOT NULL DEFAULT 0
);

INSERT INTO plans (id, name, price, max_projects_monthly, can_view_volunteers, has_dashboard, has_ads, ad_slots) VALUES
(1, 'Gratis', 0, 1, false, false, false, 0),
(2, 'Starter', 30000, 10, true, false, false, 0),
(3, 'Professional', 70000, 20, true, true, false, 0),
(4, 'Enterprise', 150000, 50, true, true, true, 2);

-- Users (auth)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL CHECK (role IN ('volunteer','organization')),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Volunteers
CREATE TABLE volunteers (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  bio TEXT,
  phone VARCHAR(20),
  city VARCHAR(100),
  birth_date DATE,
  avatar_url VARCHAR(500),
  banner_url VARCHAR(500)
);

-- Organizations
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  phone VARCHAR(20),
  address VARCHAR(300),
  city VARCHAR(100),
  website VARCHAR(300),
  avatar_url VARCHAR(500),
  banner_url VARCHAR(500),
  plan_id INT NOT NULL DEFAULT 1 REFERENCES plans(id),
  projects_this_month INT NOT NULL DEFAULT 0,
  month_reset_date DATE NOT NULL
);

-- Tags
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(100),
  color VARCHAR(20) NOT NULL DEFAULT '#6C63FF'
);

INSERT INTO tags (name, category, color) VALUES
('Animales','Naturaleza','#FF9800'),
('Ambiental','Naturaleza','#4CAF50'),
('Causas Sociales','Social','#9C27B0'),
('Educación','Social','#2196F3'),
('Salud','Social','#F44336'),
('Tecnología','Habilidades','#00BCD4'),
('Arte y Cultura','Cultural','#E91E63'),
('Deporte','Bienestar','#FF5722'),
('Nutrición','Salud','#8BC34A'),
('Derechos Humanos','Social','#607D8B'),
('Infancia','Social','#FFC107'),
('Adulto Mayor','Social','#795548'),
('Discapacidad','Social','#9E9E9E'),
('Medio Ambiente','Naturaleza','#388E3C'),
('Emprendimiento','Económico','#FF6F00');

-- Volunteer tags
CREATE TABLE volunteer_tags (
  volunteer_id INT NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
  tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (volunteer_id, tag_id)
);

-- Projects
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  organization_id INT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500),
  location VARCHAR(300),
  max_volunteers INT,
  status VARCHAR(32) NOT NULL DEFAULT 'recruiting',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Project tags
CREATE TABLE project_tags (
  project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);

-- Project applications
CREATE TABLE project_applications (
  id SERIAL PRIMARY KEY,
  project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  volunteer_id INT NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  applied_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP,
  CONSTRAINT uq_app UNIQUE (project_id, volunteer_id)
);

-- Certificates
CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  volunteer_id INT NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
  project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  issued_at TIMESTAMP NOT NULL DEFAULT now(),
  download_paid BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT uq_cert UNIQUE (volunteer_id, project_id)
);

-- Notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(64) NOT NULL DEFAULT 'general',
  read_status BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Advertisements
CREATE TABLE advertisements (
  id SERIAL PRIMARY KEY,
  organization_id INT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  title VARCHAR(200),
  link_url VARCHAR(500),
  slot_number SMALLINT NOT NULL DEFAULT 1,
  start_date TIMESTAMP NOT NULL DEFAULT now(),
  end_date TIMESTAMP,
  active BOOLEAN NOT NULL DEFAULT true
);

COMMIT;

-- Notes:
-- 1) Run this file with psql connected to your target database (Render provides DB, connect with psql).
-- 2) If you inserted explicit ids and use SERIAL, consider running setval on sequences if needed.
