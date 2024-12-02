CREATE DATABASE bd_gerenciador;
USE bd_gerenciador;

CREATE TABLE usuario(
    id_usuario INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100),
    email VARCHAR(100),
    senha VARCHAR(300),
    cargo VARCHAR(50),
    admin boolean,
    PRIMARY KEY(id_usuario)
);

CREATE TABLE produto(
    id_produto INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100),
    preco FLOAT(3, 2),
    PRIMARY KEY(id_produto)
);