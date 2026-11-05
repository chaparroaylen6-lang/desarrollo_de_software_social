const { Router } = require('express');
const { registro, login } = require('../controllers/auth.controller');
const validar = require('../middlewares/validar.middleware');
const { registroSchema, loginSchema } = require('../validators/auth.validator');

const router = Router();

// POST /api/auth/registro
router.post('/registro', validar(registroSchema), registro);

// POST /api/auth/login
router.post('/login', validar(loginSchema), login);

module.exports = router;
