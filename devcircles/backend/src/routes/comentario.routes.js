const { Router } = require('express');
const {
  listarComentariosPorPost,
  crearComentario,
  eliminarComentario,
} = require('../controllers/comentario.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validar = require('../middlewares/validar.middleware');
const { crearComentarioSchema } = require('../validators/comentario.validator');

const router = Router();

// GET    /api/posts/:postId/comentarios
router.get('/posts/:postId/comentarios', listarComentariosPorPost);

// POST   /api/posts/:postId/comentarios — requiere autenticación
router.post(
  '/posts/:postId/comentarios',
  authMiddleware,
  validar(crearComentarioSchema),
  crearComentario
);

// DELETE /api/comentarios/:id — requiere autenticación
router.delete('/comentarios/:id', authMiddleware, eliminarComentario);

module.exports = router;