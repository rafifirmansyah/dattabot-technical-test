-- -------------------------------------------------------------
-- TablePlus 4.6.0(406)
--
-- https://tableplus.com/
--
-- Database: time_capsules_dattabot_test
-- Generation Time: 2022-03-14 01:07:41.3280
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."knex_migrations";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS knex_migrations_id_seq;

-- Table Definition
CREATE TABLE "public"."knex_migrations" (
    "id" int4 NOT NULL DEFAULT nextval('knex_migrations_id_seq'::regclass),
    "name" varchar(255),
    "batch" int4,
    "migration_time" timestamptz,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."knex_migrations_lock";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS knex_migrations_lock_index_seq;

-- Table Definition
CREATE TABLE "public"."knex_migrations_lock" (
    "index" int4 NOT NULL DEFAULT nextval('knex_migrations_lock_index_seq'::regclass),
    "is_locked" int4,
    PRIMARY KEY ("index")
);

DROP TABLE IF EXISTS "public"."time_capsule_attach_files";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS time_capsule_attach_files_id_seq;

-- Table Definition
CREATE TABLE "public"."time_capsule_attach_files" (
    "id" int8 NOT NULL DEFAULT nextval('time_capsule_attach_files_id_seq'::regclass),
    "time_capsule_id" int8,
    "file_path" text,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."time_capsules";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS time_capsules_id_seq;

-- Table Definition
CREATE TABLE "public"."time_capsules" (
    "id" int8 NOT NULL DEFAULT nextval('time_capsules_id_seq'::regclass),
    "subject" varchar(255) NOT NULL,
    "slug" text NOT NULL,
    "message" text NOT NULL,
    "release_time" timestamp NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."users";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

-- Table Definition
CREATE TABLE "public"."users" (
    "id" int8 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "email" varchar(255) NOT NULL,
    "password" varchar(255) NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

INSERT INTO "public"."knex_migrations" ("id", "name", "batch", "migration_time") VALUES
(1, '20220310071924_users_table.js', 1, '2022-03-14 01:06:52.108+07'),
(2, '20220310071955_time_capsules_table.js', 1, '2022-03-14 01:06:52.137+07'),
(3, '20220311020905_time_capsule_attach_files_table.js', 1, '2022-03-14 01:06:52.166+07');

INSERT INTO "public"."knex_migrations_lock" ("index", "is_locked") VALUES
(1, 0);

INSERT INTO "public"."time_capsule_attach_files" ("id", "time_capsule_id", "file_path") VALUES
(1, 1, 'time-capsules-file/prasasti-lobu-tua-barus-e2a0b7/305281c5444db5eebf86cb44187abe47.jpeg'),
(2, 1, 'time-capsules-file/prasasti-lobu-tua-barus-e2a0b7/12dfb4f896ff4f22a65b1f6ba469bb65.jpeg'),
(3, 2, 'time-capsules-file/prasasti-ciaruteun-69f28a/5118bda10eec8fccde136fa62407cda6.jpeg'),
(4, 2, 'time-capsules-file/prasasti-ciaruteun-69f28a/32ec0b1d3d118ad4fa836cd8173a027f.jpeg'),
(5, 3, 'time-capsules-file/prasasti-pasir-awi-5faeca/cbe07559653b64b5067658617232bc7d.jpeg'),
(6, 3, 'time-capsules-file/prasasti-pasir-awi-5faeca/ff5f3adc221d7cc7e9f7bf259a57602a.jpeg'),
(7, 3, 'time-capsules-file/prasasti-pasir-awi-5faeca/eaf0d46215509c5f9f76028ba8844f5a.jpeg');

INSERT INTO "public"."time_capsules" ("id", "subject", "slug", "message", "release_time", "created_at", "updated_at") VALUES
(1, 'Prasasti Lobu Tua (Barus)', 'prasasti-lobu-tua-barus-e2a0b7', 'Prasasti Lobu Tua atau juga dikenal sebagai Prasasti Barus berangka tahun 1088 M ditulis menggunakan aksara Tamil dan Grantha. Prasasti berbahasa Tamil ini berisi mengenai penarikan pajak dan keberadaan perkumpulan pedagang asing yang bermukim di Barus. Prasasti Lobu Tua memberikan informasi mengenai nama lama Barus yang disebut sebagai Vārōcu.', '2022-03-13 21:29:09', '2022-03-14 01:07:11.63839', '2022-03-14 01:07:11.63839'),
(2, 'Prasasti Ciaruteun', 'prasasti-ciaruteun-69f28a', 'Pada tahun 1863 di Hindia Belanda, sebuah batu besar dengan ukiran aksara purba dilaporkan ditemukan di dekat Tjampea (Ciampea), tak jauh dari Buitenzorg (kini Bogor). Batu berukir tersebut ditemukan di Kampung Muara, di aliran Ci Aruteun, salah satu anak sungai Cisadane.[1]:15 Segera pada tahun yang sama, prasasti Ciaruteun dilaporkan oleh pemimpin Bataviasche Genootschap van Kunsten en Wetenschappen (sekarang Museum Nasional) di Batavia. Akibat banjir besar pada tahun 1893 batu prasasti ini terhanyutkan beberapa meter ke hilir dan bagian batu yang bertulisan menjadi terbalik posisinya ke bawah. Kemudian pada tahun 1903 prasasti ini dipindahkan ke tempat semula.', '2022-03-13 21:32:09', '2022-03-14 01:07:11.63839', '2022-03-14 01:07:11.63839'),
(3, 'Prasasti Pasir Awi', 'prasasti-pasir-awi-5faeca', 'Prasasti Pasir Awi adalah salah satu dari tujuh prasasti peninggalan kerajaan tertua di barat Pulau Jawa. Prasasti ini telah ditetapkan menjadi Benda Cagar Budaya peringkat nasional. Berbeda dengan keenam prasasti lainnya yang hampir seluruhnya berada di dekat aliran sungai, lokasi prasasti ini justru berada di perbukitan. Tepatnya di sebelah selatan bukit Pasir Awi (± 559 mdpl) di kawasan hutan di perbukitan Cipamingkis Kabupaten Bogor. Untuk bisa sampai ke lokasi prasasti, kita dapat melalui Jalan Sukaraja Dayeuh. Kemudian masuk ke jalan berbatuan dengan medan yang cukup menyulitkan kendaraan yang melaluinya. Selesai jalan berbatuan dilalui, selanjutnya dihadapkan dengan undakan anak tangga yang cukup curam. Setelah menaiki tangga itu, akhirnya sampailah di lokasi insitu tempat Prasasti Pasir Awi. Sejarah prasasti ini tidaklah banyak diungkap. Hanya saja keberadaannya sudah diketahui sejak 1864. Ditemukan kali pertama oleh seorang arkeolog asal Belanda, bernama N.W. Hoepermans. S. Pada prasasti ini terdapat pahatan sepasang tapak kaki yang menghadap ke arah utara dan timur. Pahatan serupa juga ditemukan di Prasasti Ciaruteun dan Prasasti Pasir Jambu yang terletak di Kecamatan Cibungbulan dan Kecamatan Nanggung, Kabupaten Bogor. Pahatan tapak kaki tersebut dianggap sebagai tapak kaki milik Sri Purnawarman raja dari Kerajaan Taruma atau Tarumanegara. Kerajaan ini pernah berjaya pada abad ke-4 hingga abad ke-7 Masehi.', '2022-03-16 12:32:09', '2022-03-14 01:07:11.63839', '2022-03-14 01:07:11.63839');

INSERT INTO "public"."users" ("id", "email", "password", "created_at", "updated_at") VALUES
(1, 'propertypurpose@snakebutt.com', '$2a$10$HWNqTSHu9zOnInLz0nkv6eo0w8ypKrj23oQwLBPvfR4Aa21gN3/Fi', '2022-03-14 01:07:11.620826', '2022-03-14 01:07:11.620826'),
(2, 'darthmar@emvil.com', '$2a$10$kgaffJJfyOF42QY3/2aC8uSRO7ll5uGZu74EaQxXZdwAeqMU1TGq6', '2022-03-14 01:07:11.620826', '2022-03-14 01:07:11.620826');

ALTER TABLE "public"."time_capsule_attach_files" ADD FOREIGN KEY ("time_capsule_id") REFERENCES "public"."time_capsules"("id") ON DELETE CASCADE;
