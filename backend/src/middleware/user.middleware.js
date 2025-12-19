module.exports = function (req, res, next) {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({ error: "Only users can book tickets" });
  }
  next();
};
