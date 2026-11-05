/**
 * Envuelve controllers async para pasar errores al manejador central de Express.
 * Sin esto, una promesa rechazada cuelga la request sin respuesta.
 *
 * Uso: router.get('/ruta', asyncHandler(miController))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
