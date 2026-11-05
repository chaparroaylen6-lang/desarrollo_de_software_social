const { Router } = require('express');
const {
  listarPosts,
  obtenerPost,
  crearPost,
  editarPost,
  eliminarPost,
} = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validar = require('../middlewares/validar.middleware');
const { crearPostSchema, editarPostSchema } = require('../validators/post.validator');

const router = Router();

// GET  /api/posts?pagina=1&limite=20&tipo=snippet&etiqueta=js&orden=popular
router.get('/', listarPosts);

// GET  /api/posts/:id
router.get('/:id', obtenerPost);

// POST /api/posts  — requiere autenticación
router.post('/', authMiddleware, validar(crearPostSchema), crearPost);

// PATCH /api/posts/:id
router.patch('/:id', authMiddleware, validar(editarPostSchema), editarPost);

// DELETE /api/posts/:id
router.delete('/:id', authMiddleware, eliminarPost);

module.exports = router;
