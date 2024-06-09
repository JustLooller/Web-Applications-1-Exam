"use strict";

const sqlite = require("sqlite3");

const db = new sqlite.Database("./db.sqlite", (err) => {
  if (err) throw err;
});

exports.getTitle = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT title FROM site";
    db.get(sql, (err, row) => {
      if (err) reject(err);
      else if (row === undefined)
        resolve({
          error: "Site not found.",
        });
      else {
        const title = row.title;
        resolve(title);
      }
    });
  });
};

exports.changeTitle = (title) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE site SET title = ?";
    db.run(sql, [title], (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};
