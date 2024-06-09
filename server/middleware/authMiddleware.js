"use strict";

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: "Unauthorized" });
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") return next();
  return res.status(401).json({ message: "User is not an admin." });
};

exports.isLoggedIn = isLoggedIn;
exports.isAdmin = isAdmin;
