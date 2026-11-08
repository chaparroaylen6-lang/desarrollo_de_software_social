const seguimientoModel = require('../models/seguimiento.model');
const usuarioModel = require('../models/usuario.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const toggleSeguir = asyncHandler(async (req, res) => {
  const seguidoId = req.params.id;
  const seguidorId = req.usuario.id;

  if (Number(seguidoId) === seguidorId) {
    throw new AppError('No te podés seguir a vos mismo', 400);
  }

  const usuarioExiste = await usuarioModel.buscarPorId(seguidoId);
  if (!usuarioExiste) throw new AppError('Usuario no encontrado', 404);

  const yaSigue = await seguimientoModel.existe(seguidorId, seguidoId);

  if (yaSigue) {
    await seguimientoModel.eliminar(seguidorId, seguidoId);
    res.json({ message: 'Dejaste de seguir al usuario', siguiendo: false });
  } else {
    await seguimientoModel.crear(seguidorId, seguidoId);
    res.status(201).json({ message: 'Ahora seguís al usuario', siguiendo: true });
  }
});

module.exports = {
  toggleSeguir,
};