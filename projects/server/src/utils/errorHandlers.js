// Handle validation errors
function handleValidationErrors(errors) {
  if (!errors.isEmpty()) {
    throw {
      status_code: 400,
      message: "Format error at backend",
      errors: errors.array(),
    };
  }
}

// Handle server errors
function handleServerError(error, next) {
  if (error && error.status_code && error.message) {
    next(error);
  } else {
    next({
      status_code: 500,
      message: "Server error!",
    });
  }
}

module.exports = {
  handleValidationErrors,
  handleServerError,
};