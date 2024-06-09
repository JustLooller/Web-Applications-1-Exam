"use strict";

const sqlite = require("sqlite3");
const dayjs = require("dayjs");

const db = new sqlite.Database("./db.sqlite", (err) => {
  if (err) throw err;
});

exports.getPages = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT *,pages.id as page_id, b.id as block_id FROM pages, blocks b WHERE pages.id = b.page_id";
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      const pages = {};
      let currentPage = null;
      rows.forEach((row) => {
        if (currentPage === null || currentPage.id !== row.page_id) {
          currentPage = {
            id: row.page_id,
            title: row.title,
            author: row.author,
            creation_date: row.creation_date,
            publication_date: row.publication_date,
            blocks: [],
          };
          pages[currentPage.id] = currentPage;
        }
        if (row.block_id !== null) {
          currentPage.blocks.push({
            id: row.block_id,
            page_id: row.page_id,
            type: row.type,
            content: row.content,
            position: row.position,
          });
        }
      });
      resolve(Object.values(pages));
    });
  });
};
exports.getPublishedPages = () => {
  const today = dayjs().format("YYYY-MM-DD");
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT *,pages.id as page_id, b.id as block_id FROM pages, blocks b WHERE pages.id = b.page_id AND publication_date <= DATE(?) AND publication_date IS NOT NULL";
    db.all(sql, [today], (err, rows) => {
      if (err) reject(err);
      const pages = {};
      let currentPage = null;
      rows.forEach((row) => {
        if (currentPage === null || currentPage.id !== row.page_id) {
          currentPage = {
            id: row.page_id,
            title: row.title,
            author: row.author,
            creation_date: row.creation_date,
            publication_date: row.publication_date,
            blocks: [],
          };
          pages[currentPage.id] = currentPage;
        }
        if (row.block_id !== null) {
          currentPage.blocks.push({
            id: row.id,
            page_id: row.page_id,
            type: row.type,
            content: row.content,
            position: row.position,
          });
        }
      });
      resolve(Object.values(pages));
    });
  });
};

exports.getPageById = (id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT *, pages.id as page_id, b.id as block_id FROM pages, blocks b WHERE pages.id = ? AND pages.id = b.page_id";
    db.all(sql, [id], (err, rows) => {
      if (err) reject(err);
      else if (rows === undefined) reject({ error: "Page not found." });
      else {
        const page = {
          id: rows[0].page_id,
          title: rows[0].title,
          author: rows[0].author,
          creation_date: rows[0].creation_date,
          publication_date: rows[0].publication_date,
          blocks: [],
        };
        rows.forEach((row) => {
          if (row.block_id !== null) {
            page.blocks.push({
              id: row.block_id,
              page_id: row.page_id,
              type: row.type,
              content: row.content,
              position: row.position,
            });
          }
        });
        resolve(page);
      }
    });
  });
};

exports.getAllAuthors = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT DISTINCT author FROM pages";
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      const authors = [];
      rows.forEach((row) => {
        authors.push(row.author);
      });
      resolve(authors);
    });
  });
};

exports.createPage = (page, requester) => {
  const blocks = page.blocks;
  let headerFound = false;
  let otherFound = false;
  //check that at least the header block and one other block are present
  for (const block of blocks) {
    if (block.type === "header") {
      headerFound = true;
    }
    if (block.type !== "header") {
      otherFound = true;
    }
  }
  //if i didnt find both, throw an error
  if (!headerFound || !otherFound) {
    return Promise.reject(
      "You must have at least one header block and one other block"
    );
  }

  //check that the requester is admin
  if (requester.role !== "admin") {
    //not admin, can create page only for himself
    if (requester.username !== page.author) {
      return Promise.reject("You can only create pages for yourself");
    }
  }

  let pageId = null;
  //insert the page
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO pages (title, author, creation_date, publication_date) VALUES (?, ?, ?, ?)";
    db.run(
      sql,
      [
        page.title,
        page.author,
        dayjs().format("YYYY-MM-DD"),
        page.publication_date,
      ],
      function (err) {
        if (err) reject(err);
        else {
          pageId = this.lastID;

          //insert the blocks
          for (const block of blocks) {
            const sql =
              "INSERT INTO blocks (page_id, type, content, position) VALUES (?, ?, ?, ?)";
            db.run(
              sql,
              [pageId, block.type, block.content, block.position],
              function (err) {
                if (err) reject(err);
                else resolve(pageId);
              }
            );
          }
        }
      }
    );
  });
};

exports.editPage = (page, requester) => {
  const blocks = page.blocks;

  let headerFound = false;
  let otherFound = false;
  //check that at least the header block and one other block are present
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === "header") {
      headerFound = true;
    }
    if (blocks[i].type !== "header") {
      otherFound = true;
    }
  }
  //if i didnt find both, throw an error
  if (!headerFound || !otherFound) {
    return Promise.reject(
      "You must have at least one header block and one other block"
    );
  }

  let foundPage = null;
  let isAdmin = false;
  let isAuthor = false;

  //check that the requester is admin
  if (requester.role === "admin") {
    isAdmin = true;
  }

  //check that the requester is the author of the page
  if (requester.username === page.author) {
    isAuthor = true;
  }

  //check that the page exists
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM pages WHERE id = ?";
    db.get(sql, [page.id], (err, row) => {
      if (err) reject(err);
      else if (!row) reject("This page does not exist.");
      else {
        foundPage = row;
        //check that the requester is admin
        if (!isAdmin) {
          //no admin, so we have to check if the requester is the author of the page
          if (!isAuthor) {
            reject("You can only edit pages you created");
          }
          //is author but not admin, can edit the page but not the author
          else {
            //update the page
            const sql =
              "UPDATE pages SET title = ?, publication_date = ? WHERE id = ?";
            db.run(
              sql,
              [page.title, page.publication_date, page.id],
              function (err) {
                if (err) reject(err);
                else {
                  //delete all the blocks
                  const sql = "DELETE FROM blocks WHERE page_id = ?";
                  db.run(sql, [page.id], function (err) {
                    if (err) reject(err);
                    else {
                      //insert the blocks
                      for (const block of blocks) {
                        const sql =
                          "INSERT INTO blocks (page_id, type, content, position) VALUES (?, ?, ?, ?)";
                        db.run(
                          sql,
                          [page.id, block.type, block.content, block.position],
                          function (err) {
                            if (err) reject(err);
                            else resolve(this.lastID);
                          }
                        );
                      }
                    }
                  });
                }
              }
            );
          }
        }
        //is admin, can edit the page and the author
        else {
          //update the page
          const sql =
            "UPDATE pages SET title = ?, author = ?, publication_date = ? WHERE id = ?";
          db.run(
            sql,
            [page.title, page.author, page.publication_date, page.id],
            function (err) {
              if (err) reject(err);
              else {
                //delete all the blocks
                const sql = "DELETE FROM blocks WHERE page_id = ?";
                db.run(sql, [page.id], function (err) {
                  if (err) reject(err);
                  else {
                    //insert the blocks
                    for (const block of blocks) {
                      const sql =
                        "INSERT INTO blocks (page_id, type, content, position) VALUES (?, ?, ?, ?)";
                      db.run(
                        sql,
                        [page.id, block.type, block.content, block.position],
                        function (err) {
                          if (err) reject(err);
                          else resolve(this.lastID);
                        }
                      );
                    }
                  }
                });
              }
            }
          );
        }
      }
    });
  });
};

exports.deletePage = (id, requester) => {
  return new Promise((resolve, reject) => {
    //check that the page exists
    const sql = "SELECT * FROM pages WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (!row) reject("This page does not exist.");
      else {
        //check that the requester is admin
        const sql1 = "SELECT role FROM users WHERE id = ?";
        db.get(sql1, [requester.id], (err, row) => {
          if (err) reject(err);
          else if (!row) reject("This user does not exist.");
          else {
            if (row.role !== "admin") {
              //no admin, so we have to check if the requester is the author of the page
              const sql2 = "SELECT author FROM pages WHERE id = ?";
              db.get(sql2, [id], (err, row) => {
                if (err) reject(err);
                else if (!row) reject("This page does not exist.");
                else {
                  if (row.author !== requester.username)
                    reject("You are not allowed to delete this page.");
                  else {
                    //no admin and author, delete the page and blocks
                    const sql = "DELETE FROM pages WHERE id = ?";
                    db.run(sql, [id], function (err) {
                      if (err) reject(err);
                      else {
                        const sql = "DELETE FROM blocks WHERE page_id = ?";
                        db.run(sql, [id], function (err) {
                          if (err) reject(err);
                          else resolve(this.changes);
                        });
                      }
                    });
                  }
                }
              });
            } else {
              //admin, delete the page and blocks
              const sql = "DELETE FROM pages WHERE id = ?";
              db.run(sql, [id], function (err) {
                if (err) reject(err);
                else {
                  const sql = "DELETE FROM blocks WHERE page_id = ?";
                  db.run(sql, [id], function (err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                  });
                }
              });
            }
          }
        });
      }
    });
  });
};
