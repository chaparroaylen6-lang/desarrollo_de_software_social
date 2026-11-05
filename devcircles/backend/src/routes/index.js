const { Router } = require('express');

const router = Router();

router.use('/auth',  require('./auth.routes'));
router.use('/posts', require('./posts.routes'));

// Ruta de salud para verificar que la API responde
router.get('/health', (_req, res) => res.json({ status: 'ok' }));

module.exports = router;
