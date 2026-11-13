const { z } = require('zod');

const crearComentarioSchema = z.object({
  contenido: z.string().min(1, 'El comentario no puede estar vacío').max(1000),
});

module.exports = { crearComentarioSchema };