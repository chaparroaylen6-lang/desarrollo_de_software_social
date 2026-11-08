const notificacionModel = require('../models/notificacion.model');
const asyncHandler = require('../utils/asyncHandler');

const listarNotificaciones = asyncHandler(async (req, res) => {
  const notificaciones = await notificacionModel.listarPorUsuario(req.usuario.id);
  res.json({ data: notificaciones });
});

const marcarComoLeida = asyncHandler(async (req, res) => {
  await notificacionModel.marcarLeida(req.params.id, req.usuario.id);
  res.json({ message: 'Notificación marcada como leída' });
});

module.exports = {
  listarNotificaciones,
  marcarComoLeida,
};