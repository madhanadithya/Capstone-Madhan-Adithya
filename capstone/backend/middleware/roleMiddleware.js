module.exports = function (roles) {
  return function (req, res, next) {
    const userRole = req.user.role;
    if (!roles.includes(userRole))
      return res.status(403).json({ msg: "Access denied" });
    next();
  };
};
