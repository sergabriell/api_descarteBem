CREATE EXTENSION IF NOT EXISTS "uuid-ossp"

DROP TABLE users;
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  score BIGINT DEFAULT 0
);

DROP TABLE categories;
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  name VARCHAR(60) UNIQUE NOT NULL,
  score BIGINT NOT NULL
);

DROP TABLE collect_point;
CREATE TABLE IF NOT EXISTS collect_point (
  id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL
);

DROP TABLE voucher;
CREATE TABLE IF NOT EXISTS voucher (
  id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  value BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS exchange (
  id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  category_id UUID NOT NULL REFERENCES categories(id),
  collect_point_id UUID NOT NULL REFERENCES collect_point(id)
);

INSERT INTO categories (name, score) 
VALUES ('Plastico', 300), ('Vidro', 80), ('Metal', 150), ('Pilhas', 300), ('Óleo Vegetal', 300),
('Papelão', 500);

INSERT INTO voucher (name, value)
VALUES ('Cupom R$20 iFood', 6500), ('Cupom R$30 iFood', 8000), ('Cupom R$40 iFood', 9500), ('Cupom R$50 iFood', 11000), 
('Cupom R$20 Faber-Castell', 6500), ('Cupom R$30 Faber-Castell', 8000), ('Cupom R$40 Faber-Castell', 9500), ('Cupom R$50 Faber-Castell', 11000)


INSERT INTO collect_point (name, address)
VALUES ('UP Colégio Integral', 'St. A Norte QNA, 37, casa 01, Brasília, DF, 72110-370'), 
('INEESP - Instituto Nacional de Ensino Especial', 'ST. D Norte QND 47, Brasília, DF, 70297-400'), 
('Colegio Estadual Princesa Daiana', 'Parque da Barragem, Águas Lindas de Goiás, GO, 72910-000'), 
('ENFAM', 'St; de Clubes Esportivos Sul Trecho 3, lote 9, Brasília, DF, 70200-003'), 
('Escola Canadense de Brasília', 'QS 5, Águas Claras, Brasília, DF, 71955-000');
