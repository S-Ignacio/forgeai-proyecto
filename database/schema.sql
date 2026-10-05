-- FORGE AI - esquema MySQL (basado en tu modelo relacional, con AUTO_INCREMENT y CASCADE)
CREATE DATABASE IF NOT EXISTS forge_ai DEFAULT CHARACTER SET utf8mb4;
USE forge_ai;

CREATE TABLE IF NOT EXISTS Planes (
  id_plan INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(65) NOT NULL,
  precio INT NOT NULL,
  duracion_meses INT NOT NULL,
  limite_agentes INT NOT NULL,
  limite_acciones INT NOT NULL,
  PRIMARY KEY (id_plan)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Usuarios (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(170) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Suscripciones (
  id_suscripcion INT NOT NULL AUTO_INCREMENT,
  fecha_inicio DATETIME NOT NULL,
  fecha_fin DATETIME NOT NULL,
  estado VARCHAR(20) NOT NULL,
  Usuarios_id_usuario INT NOT NULL,
  Planes_id_plan INT NOT NULL,
  PRIMARY KEY (id_suscripcion),
  CONSTRAINT fk_Suscripciones_Usuarios FOREIGN KEY (Usuarios_id_usuario) REFERENCES Usuarios (id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_Suscripciones_Planes1 FOREIGN KEY (Planes_id_plan) REFERENCES Planes (id_plan)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Modelos_ia (
  id_modelo INT NOT NULL AUTO_INCREMENT,
  nombre_modelo VARCHAR(70) NOT NULL,
  tipo_tarea VARCHAR(65) NOT NULL,
  costo_token DECIMAL(10,6) NOT NULL,
  PRIMARY KEY (id_modelo)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Agentes (
  id_agente INT NOT NULL AUTO_INCREMENT,
  soporte_obsidian TINYINT NULL DEFAULT 0,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT NOT NULL,
  estado VARCHAR(25) NOT NULL DEFAULT 'activo',
  Usuarios_id_usuario INT NOT NULL,
  Modelos_ia_id_modelo INT NOT NULL,
  PRIMARY KEY (id_agente),
  CONSTRAINT fk_Agentes_Usuarios1 FOREIGN KEY (Usuarios_id_usuario) REFERENCES Usuarios (id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_Agentes_Modelos_ia1 FOREIGN KEY (Modelos_ia_id_modelo) REFERENCES Modelos_ia (id_modelo)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Herramientas (
  id_herramienta INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  tipo_permiso VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_herramienta)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Tareas (
  id_tarea INT NOT NULL AUTO_INCREMENT,
  descripcion_solicitud TEXT NOT NULL,
  prioridad VARCHAR(20) NOT NULL,
  requiere_aprobacion TINYINT NOT NULL DEFAULT 0,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Agentes_id_agente INT NOT NULL,
  PRIMARY KEY (id_tarea),
  CONSTRAINT fk_Tareas_Agentes1 FOREIGN KEY (Agentes_id_agente) REFERENCES Agentes (id_agente) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Historial_auditoria (
  id_auditoria INT NOT NULL AUTO_INCREMENT,
  accion_realizada VARCHAR(255) NOT NULL,
  detalle_ejecucion TEXT NULL,
  fecha_ejecucion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Agentes_id_agente INT NOT NULL,
  Tareas_id_tarea INT NOT NULL,
  PRIMARY KEY (id_auditoria),
  CONSTRAINT fk_Historial_auditoria_Agentes1 FOREIGN KEY (Agentes_id_agente) REFERENCES Agentes (id_agente) ON DELETE CASCADE,
  CONSTRAINT fk_Historial_auditoria_Tareas1 FOREIGN KEY (Tareas_id_tarea) REFERENCES Tareas (id_tarea) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Agentes_herramientas (
  Agentes_id_agente INT NOT NULL,
  Herramientas_id_herramienta INT NOT NULL,
  nivel_permiso VARCHAR(50) NOT NULL,
  PRIMARY KEY (Agentes_id_agente, Herramientas_id_herramienta),
  CONSTRAINT fk_Agentes_has_Herramientas_Agentes1 FOREIGN KEY (Agentes_id_agente) REFERENCES Agentes (id_agente) ON DELETE CASCADE,
  CONSTRAINT fk_Agentes_has_Herramientas_Herramientas1 FOREIGN KEY (Herramientas_id_herramienta) REFERENCES Herramientas (id_herramienta) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Datos iniciales
INSERT INTO Planes (nombre, precio, duracion_meses, limite_agentes, limite_acciones) VALUES
  ('Gratis', 0, 12, 3, 100),
  ('Pro', 19, 1, 20, 5000);

INSERT INTO Modelos_ia (nombre_modelo, tipo_tarea, costo_token) VALUES
  ('Gemini Flash', 'General', 0.000000),
  ('Groq Llama', 'Tareas rápidas', 0.000000),
  ('OpenRouter', 'Respaldo', 0.000001);

INSERT INTO Herramientas (nombre, tipo_permiso) VALUES
  ('Leer correos', 'lectura'),
  ('Consultar documentos', 'lectura'),
  ('Crear tareas', 'escritura'),
  ('Enviar correos', 'requiere aprobación');
