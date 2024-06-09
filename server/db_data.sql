BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "users" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "email" TEXT,
    "username" TEXT UNIQUE,
    "salt" TEXT,
    "password" TEXT,
    "role" TEXT
);
CREATE TABLE IF NOT EXISTS "pages" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "author" TEXT REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
    "creation_date" DATE,
    "publication_date" DATE
);
CREATE TABLE IF NOT EXISTS "blocks"(
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "page_id" INTEGER REFERENCES pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
    "type" TEXT,
    "content" TEXT,
    "position" INTEGER
);
CREATE TABLE IF NOT EXISTS "site"(
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "title" TEXT
);
INSERT INTO users (
        email,
        username,
        salt,
        password,
        role
    )
VALUES (
        "2page@test.it",
        "2pageAuthor",
        "142dfbsauid6fg4d",
        "eaf398ff795d5f27f922131108a1d5e88948a1e3df494ef431fd30ad8581a4b6",
        "admin"
    );
INSERT INTO users (
        email,
        username,
        salt,
        password,
        role
    )
VALUES (
        "0page@test.it",
        "0pageAuthor",
        "1dfb87fgcbvga98s",
        "243f09f26382d337ea2b3900a7ffa5413d31e7ac9a32484649778a868641e5de",
        "user"
    );
INSERT INTO users (
        email,
        username,
        salt,
        password,
        role
    )
VALUES (
        "admin@test.it",
        "adminUser",
        "087ghfbv543as0kl",
        "59f2cec2f18d0efed48e1bfa83e68f74f398916e259410d630499727faec6b4d",
        "admin"
    );
INSERT INTO users (
        email,
        username,
        salt,
        password,
        role
    )
VALUES (
        "user@test.it",
        "normalUser",
        "jcnf6tdg4ersaloi",
        "a9c6560e8d160fceac57be9c3d0bcb5783ce046f3214c31b36072213c795efa1",
        "user"
    );
INSERT INTO pages (
        title,
        author,
        creation_date,
        publication_date
    )
VALUES (
        "Test page",
        "2pageAuthor",
        "2023-01-01",
        "2023-03-01"
    );
INSERT INTO pages (
        title,
        author,
        creation_date,
        publication_date
    )
VALUES (
        "Test page 2",
        "2pageAuthor",
        "2022-01-01",
        "2022-01-01"
    );
INSERT INTO pages (
        title,
        author,
        creation_date,
        publication_date
    )
VALUES (
        "Test page 3",
        "normalUser",
        "2023-01-01",
        "2025-01-01"
    );
INSERT INTO pages (
        title,
        author,
        creation_date,
        publication_date
    )
VALUES (
        "Test page 4",
        "adminUser",
        "2022-01-01",
        "2022-02-01"
    );
INSERT INTO pages (
        title,
        author,
        creation_date,
        publication_date
    )
VALUES (
        "Test page 5",
        "adminUser",
        "2022-01-01",
        NULL
    );
INSERT INTO pages (
        title,
        author,
        creation_date,
        publication_date
    )
VALUES (
        "Test page 6",
        "adminUser",
        "2023-01-01",
        NULL
    );
INSERT INTO blocks (
        page_id,
        type,
        content,
        position
    )
VALUES (
        1,
        "header",
        "Lorem ipsum dolor sit amet",
        0
    );
INSERT INTO blocks (
        page_id,
        type,
        content,
        position
    )
VALUES (1, "paragraph", "Test", 1);
INSERT INTO blocks (
        page_id,
        type,
        content,
        position
    )
VALUES (1, "image", "goku.png", 2);
INSERT INTO blocks (
        page_id,
        type,
        content,
        position
    )
VALUES (
        2,
        "header",
        "Header pagina 2",
        0
    );
INSERT INTO blocks (
        page_id,
        type,
        content,
        position
    )
VALUES (
        2,
        "paragraph",
        "Test pagina 2",
        1
    );
INSERT INTO blocks (
        page_id,
        type,
        content,
        position
    )
VALUES (
        3,
        "header",
        "Header pagina 3",
        0
    );
INSERT INTO blocks (
        page_id,
        type,
        content,
        position
    )
VALUES (
        3,
        "paragraph",
        "Test pagina 3",
        1
    );
INSERT INTO blocks (
        page_id,
        type,
        content,
        position
    )
VALUES (
        3,
        "image",
        "james.jpg",
        2
    );
INSERT INTO blocks (
        page_id,
        type,
        content,
        position
    )
VALUES (
        4,
        "header",
        "Never gonna give you up",
        0
    );
INSERT INTO blocks (
        page_id,
        type,
        content,
        position
    )
VALUES (
        4,
        "paragraph",
        "Never gonna let you down",
        1
    );
INSERT INTO blocks (
        page_id,
        type,
        content,
        position
    )
VALUES (
        4,
        "image",
        "rick_astley.png",
        2
    );
INSERT INTO blocks (
        page_id,
        type,
        content,
        position
    )
VALUES (
        5,
        "header",
        "Header 5",
        0
    );
INSERT INTO blocks (
        page_id,
        type,
        content,
        position
    )
VALUES (
        5,
        "paragraph",
        "Lorem ipsum dolor sit amet",
        1
    );
INSERT INTO blocks (
        page_id,
        type,
        content,
        position
    )
VALUES (
        6,
        "header",
        "Lorem ipsum dolor sit amet",
        0
    );
INSERT INTO blocks (
        page_id,
        type,
        content,
        position
    )
VALUES (
        6,
        "paragraph",
        "Lorem ipsum dolor sit amet",
        1
    );
INSERT INTO site (title)
VALUES ("CMSmall");
COMMIT;