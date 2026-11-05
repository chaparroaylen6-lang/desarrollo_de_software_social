create database if not exists devcircles;
use devcircles;

create table usuarios(
    id_usuario int auto_increment primary key,
    nombre varchar(100) not null,
    email varchar(150) not null unique,
    password varchar(255) not null,
    avatar varchar(255),
    fecha_registro datetime default current_timestamp
);

create table posts(
    id_post int auto_increment primary key,
    id_usuario int not null,
    contenido text not null,
    fecha_creacion datetime default current_timestamp,
    FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario) on delete cascade
);

create table comentarios(
    id_comentario int auto_increment primary key,
    id_post int not null,
    id_usuario int not null,
    contenido text not null,
    fecha_creacion datetime default current_timestamp,

    FOREIGN KEY (id_post) REFERENCES posts(id_post)on delete cascade,
    FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario)on delete cascade
);

create table likes (
    id_usuario int not null,
    id_post int not null,

    PRIMARY KEY(id_usuario, id_post),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)on delete cascade,
    FOREIGN KEY (id_post) REFERENCES posts(id_post)on delete cascade
);