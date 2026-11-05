const AppError = require('../utils/AppError');

/**
 * Uso: requiereRol('moderador', 'admin')
 * Debe ir después de authMiddleware en la cadena de middlewares.
 */
const requiereRol = (...roles) => (req, res, next) => {
  if (!roles.includes(req.usuario?.rol)) {
    return next(new AppError('No tenés permiso para esta acción', 403));
  }
  next();
};

module.exports = requiereRol;
