"use strict";

const crypto = require("crypto");
const sqlite = require("sqlite3");

const db = new sqlite.Database("./db.sqlite", (err) => {
  if (err) throw err;
});

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve({ error: "User not found." });
      else {
        const user = {
          id: row.id,
          email: row.email,
          username: row.username,
          role: row.role,
        };
        resolve(user);
      }
    });
  });
};
exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT username FROM users";
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      else {
        const users = rows.map((e) => e.username);
        resolve(users);
      }
    });
  });
};

exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = {
          id: row.id,
          email: row.email,
          username: row.username,
          role: row.role,
        };
        const salt = row.salt;
        crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
          if (err) reject(err);

          const passwordHex = Buffer.from(row.password, "hex");

          if (!crypto.timingSafeEqual(passwordHex, hashedPassword))
            resolve(false);
          else resolve(user);
        });
      }
    });
  });
};
