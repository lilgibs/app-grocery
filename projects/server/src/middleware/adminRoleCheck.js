const roleCheck = (requiredRole) => {
  return (req, res, next) => {
      const adminRole = req.admin.adminRole;
      if (adminRole !== requiredRole) {
          return res.status(403).json({
              status_code: 403,
              message: "Access denied. You are not authorized to access this route.",
          });
      }
      next();
  };
};

module.exports = roleCheck;
