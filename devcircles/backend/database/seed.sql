USE devcircles;

INSERT INTO usuarios (username, nombre_mostrado, email, password_hash, rol) VALUES
('joaquin', 'Joaquín', 'joaquin@mail.com', '$2b$12$qqgTBYCrc6t9.6FH64dac.ySLKRWvLW66sjkd6WaRYQiC.JOB9rHK', 'miembro'),
('margarita', 'Margarita', 'margarita@mail.com', '$2b$12$qqgTBYCrc6t9.6FH64dac.ySLKRWvLW66sjkd6WaRYQiC.JOB9rHK', 'miembro');

INSERT INTO posts (usuario_id, tipo, contenido) VALUES
(1, 'publicacion', 'Mi primer post probando el sistema'),
(2, 'publicacion', 'Hola a todos, este es DevCircles');

INSERT INTO comentarios (post_id, usuario_id, contenido) VALUES
(1, 2, 'Buena esa!');

INSERT INTO likes (usuario_id, post_id) VALUES
(2, 1);