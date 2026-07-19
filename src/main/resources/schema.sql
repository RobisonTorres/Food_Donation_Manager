CREATE TABLE IF NOT EXISTS families (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL,
    address VARCHAR(150) NOT NULL,
    neighborhood VARCHAR(80) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    men INT NOT NULL,
    women INT NOT NULL,
    children INT NOT NULL,
    status VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS children (
    id INT PRIMARY KEY AUTO_INCREMENT,
    family_id INT NOT NULL,
    name VARCHAR(80) NOT NULL,
    birth_date DATE NOT NULL,

    CONSTRAINT fk_children_family
        FOREIGN KEY (family_id)
        REFERENCES families(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS donations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    family_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    donation_month DATE NOT NULL,
    delivery DATE,

    CONSTRAINT fk_donations_family
        FOREIGN KEY (family_id)
        REFERENCES families(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_donation_family_month
        UNIQUE (family_id, donation_month)
);
/*
INSERT INTO families
(name, address, neighborhood, phone, men, women, children, status)
VALUES
('Família Silva', 'Rua das Flores, 123', 'Centro', '(11) 99999-1111', 1, 1, 2, 'NO'),
('Família Souza', 'Av. Paulista, 1500', 'Bela Vista', '(11) 98888-2222', 1, 1, 1, 'YES'),
('Família Santos', 'Rua Bahia, 45', 'Gonzaga', '(13) 99777-3333', 1, 2, 3, 'YES'),
('Família Oliveira', 'Av. Brasil, 890', 'Jardins', '(11) 99666-4444', 2, 1, 0, 'NO'),
('Família Pereira', 'Rua das Palmeiras, 12', 'Vila Nova', '(19) 99555-5555', 0, 1, 2, 'YES'),
('Família Lima', 'Travessa Sol, 56', 'Alvorada', '(21) 99444-6666', 1, 1, 1, 'YES'),
('Família Costa', 'Rua Rio de Janeiro, 789', 'Setor Oeste', '(62) 99333-7777', 1, 1, 4, 'NO'),
('Família Rodrigues', 'Av. Amazonas, 1200', 'Centro', '(31) 99222-8888', 2, 2, 2, 'YES'),
('Família Almeida', 'Rua XV de Novembro, 34', 'Alto da XV', '(41) 99111-9999', 1, 0, 1, 'NO'),
('Família Nascimento', 'Rua dos Coqueiros, 202', 'Praia do Canto', '(27) 99000-1010', 1, 1, 3, 'YES'),
('Família Carvalho', 'Av. Beira Mar, 500', 'Meireles', '(85) 98999-2020', 2, 1, 0, 'YES'),
('Família Araujo', 'Rua das Acácias, 88', 'Ipê', '(34) 98888-3030', 1, 1, 2, 'NO'),
('Família Melo', 'Rua Major Facundo, 412', 'Centro', '(85) 98777-4040', 0, 2, 2, 'YES'),
('Família Cardoso', 'Rua Bento Gonçalves, 95', 'Azenha', '(51) 98666-5050', 1, 1, 1, 'YES'),
('Família Teixeira', 'Av. Getúlio Vargas, 1430', 'Funcionários', '(31) 98555-6060', 1, 1, 3, 'NO'),
('Família Barbosa', 'Rua Sergipe, 321', 'Consolação', '(11) 98444-7070', 2, 1, 1, 'YES'),
('Família Cavalcanti', 'Rua do Futuro, 850', 'Aflitos', '(81) 98333-8080', 1, 1, 2, 'YES'),
('Família Dias', 'Rua Chile, 15', 'Recreio', '(77) 98222-9090', 1, 2, 0, 'NO'),
('Família Castro', 'Rua das Laranjeiras, 44', 'Cosme Velho', '(21) 98111-0101', 1, 1, 1, 'YES'),
('Família Gomes', 'Rua da Aurora, 300', 'Boa Vista', '(81) 98000-1212', 2, 1, 3, 'YES'),
('Família Martins', 'Av. Afonso Pena, 2040', 'Amambaí', '(67) 97999-2323', 1, 1, 2, 'NO'),
('Família Rocha', 'Rua dos Pinheiros, 610', 'Pinheiros', '(11) 97888-3434', 1, 1, 0, 'YES'),
('Família Ribeiro', 'Rua General Osório, 77', 'Centro', '(16) 97777-4545', 0, 1, 1, 'YES'),
('Família Carvalho', 'Rua Sete de Setembro, 888', 'Centro', '(47) 97666-5656', 1, 1, 2, 'NO'),
('Família Mendes', 'Av. ACM, 4500', 'Itaigara', '(71) 97555-6767', 1, 2, 3, 'YES'),
('Família Freitas', 'Rua da Paz, 101', 'Utinga', '(11) 97444-7878', 2, 1, 1, 'YES'),
('Família Ramos', 'Rua Santo Antônio, 55', 'Campina', '(91) 97333-8989', 1, 1, 4, 'NO'),
('Família Vieira', 'Av. Alberto Craveiro, 90', 'Castelão', '(85) 97222-9090', 1, 1, 2, 'YES'),
('Família Cunha', 'Rua Voluntários da Pátria, 43', 'Botafogo', '(21) 97111-0102', 1, 1, 1, 'YES'),
('Família Assis', 'Rua Marechal Deodoro, 120', 'Batell', '(41) 97000-1122', 2, 1, 0, 'NO');

INSERT INTO children (family_id, name, birth_date)
VALUES
-- Família 1 (Silva - 2 crianças)
(1, 'Pedro Silva', '2018-04-12'),
(1, 'Lucas Silva', '2021-08-23'),
-- Família 2 (Souza - 1 criança)
(2, 'Beatriz Souza', '2019-11-05'),
-- Família 3 (Santos - 3 crianças)
(3, 'Mariana Santos', '2015-03-22'),
(3, 'Gustavo Santos', '2017-07-14'),
(3, 'Clara Santos', '2020-12-05'),
-- Família 5 (Pereira - 2 crianças)
(5, 'Enzo Pereira', '2016-01-30'),
(5, 'Valentina Pereira', '2019-05-18'),
-- Família 6 (Lima - 1 criança)
(6, 'Gabriel Lima', '2022-02-10'),
-- Família 7 (Costa - 4 crianças)
(7, 'Felipe Costa', '2013-09-15'),
(7, 'Mateus Costa', '2015-11-02'),
(7, 'Isadora Costa', '2018-06-25'),
(7, 'Thiago Costa', '2021-04-10'),
-- Família 8 (Rodrigues - 2 crianças)
(8, 'Alice Rodrigues', '2017-10-08'),
(8, 'Miguel Rodrigues', '2020-01-19'),
-- Família 9 (Almeida - 1 criança)
(9, 'Arthur Almeida', '2014-08-30'),
-- Família 10 (Nascimento - 3 crianças)
(10, 'Sophia Nascimento', '2016-05-12'),
(10, 'Davi Nascimento', '2019-09-03'),
(10, 'Laura Nascimento', '2022-11-20'),
-- Família 12 (Araujo - 2 crianças)
(12, 'Rafael Araujo', '2017-03-14'),
(12, 'Manuela Araujo', '2020-07-29'),
-- Família 13 (Melo - 2 crianças)
(13, 'Juliana Melo', '2015-11-11'),
(13, 'Bruno Melo', '2018-02-28'),
-- Família 14 (Cardoso - 1 criança)
(14, 'Henrique Cardoso', '2021-10-05'),
-- Família 15 (Teixeira - 3 crianças)
(15, 'Gabriela Teixeira', '2014-04-17'),
(15, 'Daniel Teixeira', '2017-06-02'),
(15, 'Lorena Teixeira', '2020-09-14'),
-- Família 16 (Barbosa - 1 criança)
(16, 'Cecília Barbosa', '2019-01-22'),
-- Família 17 (Cavalcanti - 2 crianças)
(17, 'Samuel Cavalcanti', '2016-08-08'),
(17, 'Helena Cavalcanti', '2021-03-17'),
-- Família 19 (Castro - 1 criança)
(19, 'Murilo Castro', '2018-12-12'),
-- Família 20 (Gomes - 3 crianças)
(20, 'Luiza Gomes', '2015-05-05'),
(20, 'Pedro Gomes', '2018-07-19'),
(20, 'Giovanna Gomes', '2021-10-31'),
-- Família 21 (Martins - 2 crianças)
(21, 'Nicolas Martins', '2017-02-25'),
(21, 'Lara Martins', '2020-06-14'),
-- Família 23 (Ribeiro - 1 criança)
(23, 'Bernardo Ribeiro', '2019-09-09'),
-- Família 24 (Carvalho - 2 crianças)
(24, 'Heitor Carvalho', '2016-12-01'),
(24, 'Lívia Carvalho', '2020-04-18'),
-- Família 25 (Mendes - 3 crianças)
(25, 'Matheus Mendes', '2013-08-11'),
(25, 'Beatriz Mendes', '2016-10-24'),
(25, 'Leonardo Mendes', '2021-01-05'),
-- Família 26 (Freitas - 1 criança)
(26, 'Yago Freitas', '2018-03-15'),
-- Família 27 (Ramos - 4 crianças)
(27, 'Sandro Ramos', '2012-07-04'),
(27, 'Ester Ramos', '2014-11-18'),
(27, 'Vinícius Ramos', '2017-05-22'),
(27, 'Marina Ramos', '2021-09-09'),
-- Família 28 (Vieira - 2 crianças)
(28, 'Otávio Vieira', '2016-02-27'),
(28, 'Melissa Vieira', '2019-08-12'),
-- Família 29 (Cunha - 1 criança)
(29, 'Emanuel Cunha', '2022-01-01');

INSERT INTO donations (family_id, status, donation_month, delivery)
VALUES
(1, 'OK', '2026-07-01', '2026-07-05'),
(2, 'PENDENT', '2026-07-01', NULL),
(3, 'OK', '2026-07-01', '2026-07-02'),
(4, 'OK', '2026-07-01', '2026-07-04'),
(5, 'PENDENT', '2026-07-01', NULL),
(6, 'OK', '2026-07-01', '2026-07-06'),
(7, 'PENDENT', '2026-07-01', NULL),
(8, 'OK', '2026-07-01', '2026-07-03'),
(9, 'OK', '2026-07-01', '2026-07-08'),
(10, 'PENDENT', '2026-07-01', NULL),
(11, 'OK', '2026-07-01', '2026-07-01'),
(12, 'PENDENT', '2026-07-01', NULL),
(13, 'OK', '2026-07-01', '2026-07-07'),
(14, 'OK', '2026-07-01', '2026-07-06'),
(15, 'PENDENT', '2026-07-01', NULL),
(16, 'OK', '2026-07-01', '2026-07-05'),
(17, 'OK', '2026-07-01', '2026-07-02'),
(18, 'PENDENT', '2026-07-01', NULL),
(19, 'OK', '2026-07-01', '2026-07-04'),
(20, 'OK', '2026-07-01', '2026-07-05'),
(21, 'PENDENT', '2026-07-01', NULL),
(22, 'OK', '2026-07-01', '2026-07-03'),
(23, 'OK', '2026-07-01', '2026-07-02'),
(24, 'PENDENT', '2026-07-01', NULL),
(25, 'OK', '2026-07-01', '2026-07-07'),
(26, 'PENDENT', '2026-07-01', NULL),
(27, 'PENDENT', '2026-07-01', NULL),
(28, 'OK', '2026-07-01', '2026-07-05'),
(29, 'OK', '2026-07-01', '2026-07-04'),
(30, 'PENDENT', '2026-07-01', NULL);
*/