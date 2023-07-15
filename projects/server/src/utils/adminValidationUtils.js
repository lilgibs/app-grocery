const validateAdminRole = (adminRole, requiredRole = 99) => {
  if (adminRole !== requiredRole) {
    throw {
      status_code: 403,
      message: "Access denied. You are not authorized to access this route.",
    };
  }
}

module.exports = {
  validateAdminRole
}
