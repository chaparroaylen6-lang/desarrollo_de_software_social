CREATE DATABASE IF NOT EXISTS devcircles;
USE devcircles;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(150) NOT NULL UNIQUE,
  nombre_mostrado VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  bio TEXT,
  rol VARCHAR(20) NOT NULL DEFAULT 'miembro',
  reputacion INT NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  titulo VARCHAR(150),
  contenido TEXT NOT NULL,
  likes_count INT NOT NULL DEFAULT 0,
  comentarios_count INT NOT NULL DEFAULT 0,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  eliminado BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE snippets (
  post_id INT PRIMARY KEY,
  lenguaje VARCHAR(30),
  codigo TEXT NOT NULL,
  nombre_archivo VARCHAR(120),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE etiquetas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL,
  slug VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE post_etiquetas (
  post_id INT NOT NULL,
  etiqueta_id INT NOT NULL,
  PRIMARY KEY (post_id, etiqueta_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id) ON DELETE CASCADE
);

CREATE TABLE comentarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  usuario_id INT NOT NULL,
  contenido TEXT NOT NULL,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE likes (
  usuario_id INT NOT NULL,
  post_id INT NOT NULL,
  PRIMARY KEY (usuario_id, post_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
CREATE TABLE seguimiento (
  seguidor_id INT NOT NULL,
  seguido_id INT NOT NULL,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (seguidor_id, seguido_id),
  FOREIGN KEY (seguidor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (seguido_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE notificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo VARCHAR(30) NOT NULL,
  mensaje VARCHAR(255) NOT NULL,
  leido BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE reportes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  post_id INT NULL,
  comentario_id INT NULL,
  razon VARCHAR(255) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (comentario_id) REFERENCES comentarios(id) ON DELETE CASCADE
);