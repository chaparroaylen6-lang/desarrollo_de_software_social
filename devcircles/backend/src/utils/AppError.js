class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.isOperational = true; // errores esperados vs bugs inesperados
  }
}

module.exports = AppError;
