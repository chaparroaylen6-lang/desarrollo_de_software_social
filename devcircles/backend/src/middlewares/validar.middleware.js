const AppError = require('../utils/AppError');

/**
 * Valida req.body contra un esquema Zod.
 * Si falla, responde 422 con la lista de errores de cada campo.
 *
 * Uso: router.post('/ruta', validar(miEsquemaZod), miController)
 */
const validar = (schema) => (req, res, next) => {
  const resultado = schema.safeParse(req.body);
  if (!resultado.success) {
    const errores = resultado.error.errors.map((e) => ({
      campo:   e.path.join('.'),
      mensaje: e.message,
    }));
    return res.status(422).json({ error: 'Datos inválidos', errores });
  }
  req.body = resultado.data; // reemplaza con los valores parseados y sanitizados
  next();
};

module.exports = validar;
