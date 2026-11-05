const usuarioModel = require('../models/usuario.model');
const { hash, compare } = require('../utils/password');
const { firmar } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const registro = asyncHandler(async (req, res) => {
  const { username, email, password, nombre_mostrado } = req.body;

  // Verificar unicidad antes de intentar insertar (da un mensaje más claro que ER_DUP_ENTRY)
  const emailExiste = await usuarioModel.buscarPorEmail(email);
  if (emailExiste) throw new AppError('El email ya está registrado', 409);

  const password_hash = await hash(password);
  const id = await usuarioModel.crear({ username, email, password_hash, nombre_mostrado });

  const token = firmar({ id, username, rol: 'miembro' });
  res.status(201).json({ token, usuario: { id, username, nombre_mostrado: nombre_mostrado ?? username } });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const usuario = await usuarioModel.buscarPorEmail(email);
  // Mismo mensaje para email y contraseña incorrectos: evita enumerar usuarios
  if (!usuario) throw new AppError('Credenciales inválidas', 401);

  const passwordOk = await compare(password, usuario.password_hash);
  if (!passwordOk) throw new AppError('Credenciales inválidas', 401);

  const token = firmar({ id: usuario.id, username: usuario.username, rol: usuario.rol });
  res.json({
    token,
    usuario: {
      id:              usuario.id,
      username:        usuario.username,
      nombre_mostrado: usuario.nombre_mostrado,
      rol:             usuario.rol,
      avatar_url:      usuario.avatar_url,
    },
  });
});

module.exports = { registro, login };
