const { verificar } = require('../utils/jwt');
const AppError = require('../utils/AppError');

/**
 * Verifica el JWT del header Authorization: Bearer <token>.
 * Si es válido, inyecta req.usuario = { id, username, rol }.
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Token requerido', 401));
  }

  const token = header.slice(7); // quita "Bearer "
  try {
    req.usuario = verificar(token);
    next();
  } catch {
    next(new AppError('Token inválido o expirado', 401));
  }
}

module.exports = authMiddleware;
