-- ============================================================
--  VolDigital — Base de datos completa
--  Compatible con MySQL 5.7+ / MariaDB (XAMPP)
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS `voldigital`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `voldigital`;

-- -----------------------------------------------------------
-- Planes de suscripción
-- -----------------------------------------------------------
CREATE TABLE `plans` (
  `id`                    INT          NOT NULL AUTO_INCREMENT,
  `name`                  VARCHAR(50)  NOT NULL,
  `price`                 INT          NOT NULL DEFAULT 0,
  `max_projects_monthly`  INT          NOT NULL DEFAULT 1,
  `can_view_volunteers`   TINYINT(1)   NOT NULL DEFAULT 0,
  `has_dashboard`         TINYINT(1)   NOT NULL DEFAULT 0,
  `has_ads`               TINYINT(1)   NOT NULL DEFAULT 0,
  `ad_slots`              INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `plans` VALUES
(1, 'Gratis',       0,      1,  0, 0, 0, 0),
(2, 'Starter',      30000,  10, 1, 0, 0, 0),
(3, 'Professional', 70000,  20, 1, 1, 0, 0),
(4, 'Enterprise',   150000, 50, 1, 1, 1, 2);

-- -----------------------------------------------------------
-- Usuarios (auth)
-- -----------------------------------------------------------
CREATE TABLE `users` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `email`      VARCHAR(255) NOT NULL,
  `password`   VARCHAR(255) NOT NULL,
  `role`       ENUM('volunteer','organization') NOT NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Perfiles de voluntarios
-- -----------------------------------------------------------
CREATE TABLE `volunteers` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `user_id`    INT          NOT NULL,
  `name`       VARCHAR(100) NOT NULL,
  `last_name`  VARCHAR(100) NOT NULL,
  `bio`        TEXT,
  `phone`      VARCHAR(20),
  `city`       VARCHAR(100),
  `birth_date` DATE,
  `avatar_url` VARCHAR(500),
  `banner_url` VARCHAR(500),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_vol_user` FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Perfiles de organizaciones
-- -----------------------------------------------------------
CREATE TABLE `organizations` (
  `id`                  INT          NOT NULL AUTO_INCREMENT,
  `user_id`             INT          NOT NULL,
  `name`                VARCHAR(200) NOT NULL,
  `description`         TEXT,
  `phone`               VARCHAR(20),
  `address`             VARCHAR(300),
  `city`                VARCHAR(100),
  `website`             VARCHAR(300),
  `avatar_url`          VARCHAR(500),
  `banner_url`          VARCHAR(500),
  `plan_id`             INT          NOT NULL DEFAULT 1,
  `projects_this_month` INT          NOT NULL DEFAULT 0,
  `month_reset_date`    DATE         NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_org_user` FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_org_plan` FOREIGN KEY (`plan_id`)
    REFERENCES `plans`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Etiquetas predefinidas
-- -----------------------------------------------------------
CREATE TABLE `tags` (
  `id`       INT         NOT NULL AUTO_INCREMENT,
  `name`     VARCHAR(100) NOT NULL,
  `category` VARCHAR(100),
  `color`    VARCHAR(20)  NOT NULL DEFAULT '#6C63FF',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tag_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tags` (`name`, `category`, `color`) VALUES
('Animales',        'Naturaleza',   '#FF9800'),
('Ambiental',       'Naturaleza',   '#4CAF50'),
('Causas Sociales', 'Social',       '#9C27B0'),
('Educación',       'Social',       '#2196F3'),
('Salud',           'Social',       '#F44336'),
('Tecnología',      'Habilidades',  '#00BCD4'),
('Arte y Cultura',  'Cultural',     '#E91E63'),
('Deporte',         'Bienestar',    '#FF5722'),
('Nutrición',       'Salud',        '#8BC34A'),
('Derechos Humanos','Social',       '#607D8B'),
('Infancia',        'Social',       '#FFC107'),
('Adulto Mayor',    'Social',       '#795548'),
('Discapacidad',    'Social',       '#9E9E9E'),
('Medio Ambiente',  'Naturaleza',   '#388E3C'),
('Emprendimiento',  'Económico',    '#FF6F00');

-- -----------------------------------------------------------
-- Etiquetas del voluntario
-- -----------------------------------------------------------
CREATE TABLE `volunteer_tags` (
  `volunteer_id` INT NOT NULL,
  `tag_id`       INT NOT NULL,
  PRIMARY KEY (`volunteer_id`, `tag_id`),
  CONSTRAINT `fk_vt_vol` FOREIGN KEY (`volunteer_id`)
    REFERENCES `volunteers`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vt_tag` FOREIGN KEY (`tag_id`)
    REFERENCES `tags`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Proyectos
-- -----------------------------------------------------------
CREATE TABLE `projects` (
  `id`              INT          NOT NULL AUTO_INCREMENT,
  `organization_id` INT          NOT NULL,
  `title`           VARCHAR(200) NOT NULL,
  `description`     TEXT         NOT NULL,
  `image_url`       VARCHAR(500),
  `location`        VARCHAR(300),
  `max_volunteers`  INT,
  `status`          ENUM('recruiting','active','completed','cancelled')
                    NOT NULL DEFAULT 'recruiting',
  `start_date`      DATE,
  `end_date`        DATE,
  `created_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_proj_org` FOREIGN KEY (`organization_id`)
    REFERENCES `organizations`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Etiquetas del proyecto
-- -----------------------------------------------------------
CREATE TABLE `project_tags` (
  `project_id` INT NOT NULL,
  `tag_id`     INT NOT NULL,
  PRIMARY KEY (`project_id`, `tag_id`),
  CONSTRAINT `fk_pt_proj` FOREIGN KEY (`project_id`)
    REFERENCES `projects`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pt_tag` FOREIGN KEY (`tag_id`)
    REFERENCES `tags`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Postulaciones de voluntarios a proyectos
-- -----------------------------------------------------------
CREATE TABLE `project_applications` (
  `id`           INT      NOT NULL AUTO_INCREMENT,
  `project_id`   INT      NOT NULL,
  `volunteer_id` INT      NOT NULL,
  `status`       ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  `applied_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_app` (`project_id`, `volunteer_id`),
  CONSTRAINT `fk_app_proj` FOREIGN KEY (`project_id`)
    REFERENCES `projects`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_app_vol` FOREIGN KEY (`volunteer_id`)
    REFERENCES `volunteers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Certificados / Insignias
-- -----------------------------------------------------------
CREATE TABLE `certificates` (
  `id`            INT      NOT NULL AUTO_INCREMENT,
  `volunteer_id`  INT      NOT NULL,
  `project_id`    INT      NOT NULL,
  `issued_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `download_paid` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cert` (`volunteer_id`, `project_id`),
  CONSTRAINT `fk_cert_vol` FOREIGN KEY (`volunteer_id`)
    REFERENCES `volunteers`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cert_proj` FOREIGN KEY (`project_id`)
    REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Notificaciones
-- -----------------------------------------------------------
CREATE TABLE `notifications` (
  `id`          INT          NOT NULL AUTO_INCREMENT,
  `user_id`     INT          NOT NULL,
  `title`       VARCHAR(200) NOT NULL,
  `message`     TEXT         NOT NULL,
  `type`        ENUM('application_accepted','application_rejected',
                     'project_completed','new_application','general')
                NOT NULL DEFAULT 'general',
  `read_status` TINYINT(1)   NOT NULL DEFAULT 0,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Publicidad (plan Enterprise — 2 slots, 5 días)
-- -----------------------------------------------------------
CREATE TABLE `advertisements` (
  `id`              INT          NOT NULL AUTO_INCREMENT,
  `organization_id` INT          NOT NULL,
  `image_url`       VARCHAR(500) NOT NULL,
  `title`           VARCHAR(200),
  `link_url`        VARCHAR(500),
  `slot_number`     TINYINT      NOT NULL DEFAULT 1,
  `start_date`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date`        DATETIME     NOT NULL,
  `active`          TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ad_org` FOREIGN KEY (`organization_id`)
    REFERENCES `organizations`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
