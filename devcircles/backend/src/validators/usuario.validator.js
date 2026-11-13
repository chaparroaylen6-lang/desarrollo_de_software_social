const { z } = require('zod');

const actualizarPerfilSchema = z
  .object({
    nombre_mostrado: z.string().max(80).optional(),
    bio: z.string().max(280).optional(),
    avatar_url: z.string().url('URL inválida').max(255).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: 'Enviá al menos un campo para editar',
  });

module.exports = { actualizarPerfilSchema };