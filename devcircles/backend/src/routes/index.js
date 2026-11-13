const { Router } = require('express');

const router = Router();

router.use('/auth', require('./auth.routes'));
router.use('/posts', require('./posts.routes'));
router.use('/posts', require('./like.routes'));
router.use('/', require('./comentario.routes'));
router.use('/etiquetas', require('./etiqueta.routes'));
router.use('/usuarios', require('./usuario.routes'));
router.use('/usuarios', require('./seguimiento.routes'));
router.use('/notificaciones', require('./notificacion.routes'));
router.use('/reportes', require('./reporte.routes'));

// Ruta de salud para verificar que la API responde
router.get('/health', (_req, res) => res.json({ status: 'ok' }));

module.exports = router;