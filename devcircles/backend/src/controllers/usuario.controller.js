const usuarioModel = require('../models/usuario.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Obtener el perfil del usuario autenticado actual
const obtenerPerfilPropio = asyncHandler(async (req, res) => {
  const usuario = await usuarioModel.buscarPorId(req.usuario.id);
  if (!usuario) throw new AppError('Usuario no encontrado', 404);
  res.json({ data: usuario });
});

// Obtener un perfil público por su username
const obtenerPerfilPorUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const usuario = await usuarioModel.buscarPorUsername(username);
  if (!usuario) throw new AppError('Usuario no encontrado', 404);
  res.json({ data: usuario });
});

// Actualizar datos del perfil propio (nombre_mostrado, bio, avatar_url)
const actualizarPerfil = asyncHandler(async (req, res) => {
  await usuarioModel.actualizar(req.usuario.id, req.body);
  const usuarioActualizado = await usuarioModel.buscarPorId(req.usuario.id);
  res.json({ data: usuarioActualizado });
});

module.exports = {
  obtenerPerfilPropio,
  obtenerPerfilPorUsername,
  actualizarPerfil,
};