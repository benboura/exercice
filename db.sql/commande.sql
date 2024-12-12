CREATE DATABASE streaming_platform;

USE streaming_platform;

-- Table pour les clients
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    age INT,
    telephone VARCHAR(15),
    email VARCHAR(100),
    adresse VARCHAR(255)
);

-- Table pour les abonnements
CREATE TABLE abonnements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(100),
    go INT,
    date_souscription DATE,
    client_id INT,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

INSERT INTO abonnements (titre, go) VALUES 
("Abonnement Basic", 50),
("Abonnement Standard", 100),
("Abonnement Premium", 200);

-- Table pour l'équipe commerciale
CREATE TABLE equipe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    fonction VARCHAR(50),
    email VARCHAR(100),
    telephone VARCHAR(15),
    immatriculation VARCHAR(20)
);

INSERT INTO equipe (nom, prenom, fonction, email, telephone) VALUES ('Robinet','Sabotage', 'Designer & Responsable', 'robinet@gmail.com', '0693 21 43 56');


-- table souscriptions
CREATE TABLE souscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    abonnement_id INT NOT NULL,
    date_souscription DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (abonnement_id) REFERENCES abonnements(id)
);