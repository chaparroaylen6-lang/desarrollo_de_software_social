const { z } = require('zod');

const crearPostSchema = z
  .object({
    tipo: z.enum(['publicacion', 'snippet', 'pregunta']),
    titulo: z.string().max(150).optional(),
    contenido: z.string().min(1, 'El contenido no puede estar vacío').max(10_000),
    etiquetas: z.array(z.string().max(40)).max(5).optional(),
    // Campos de snippet — obligatorios solo cuando tipo === 'snippet'
    lenguaje:      z.string().max(30).optional(),
    codigo:        z.string().max(50_000).optional(),
    nombre_archivo: z.string().max(120).optional(),
  })
  .refine(
    (d) => d.tipo !== 'snippet' || (d.lenguaje && d.codigo),
    { message: 'Los posts de tipo snippet requieren lenguaje y codigo', path: ['codigo'] }
  );

const editarPostSchema = crearPostSchema.partial().refine(
  (d) => Object.keys(d).length > 0,
  { message: 'Enviá al menos un campo para editar' }
);

module.exports = { crearPostSchema, editarPostSchema };
