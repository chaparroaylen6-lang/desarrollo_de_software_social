const { Router } = require('express');
const { toggleLike } = require('../controllers/like.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// POST /api/posts/:postId/likes — requiere autenticación
router.post('/:postId/likes', authMiddleware, toggleLike);

module.exports = router;