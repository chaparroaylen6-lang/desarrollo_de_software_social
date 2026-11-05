const config = require('../config/env');

/**
 * Manejador central de errores. Va ÚLTIMO en app.js, después de las rutas.
 * Convierte AppError, errores de JWT y errores de MySQL en respuestas HTTP coherentes.
 */
// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  // Errores operacionales: lanzados con AppError, con status conocido
  if (err.isOperational) {
    return res.status(err.status).json({ error: err.message });
  }

  // Error de duplicado de MySQL (ej: email o username ya existe)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'El registro ya existe' });
  }

  // JWT vencido / inválido (lanzado por jsonwebtoken directamente)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  // Error inesperado: loguear y no exponer detalles en producción
  console.error('[error]', err);
  const mensaje = config.nodeEnv === 'development' ? err.message : 'Error interno del servidor';
  res.status(500).json({ error: mensaje });
}

module.exports = errorMiddleware;
