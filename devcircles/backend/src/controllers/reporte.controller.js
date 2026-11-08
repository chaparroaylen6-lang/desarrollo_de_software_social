const reporteModel = require('../models/reporte.model');
const asyncHandler = require('../utils/asyncHandler');

const crearReporte = asyncHandler(async (req, res) => {
  const { post_id, comentario_id, razon } = req.body;
  const id = await reporteModel.crear({
    usuario_id: req.usuario.id,
    post_id: post_id || null,
    comentario_id: comentario_id || null,
    razon,
  });
  res.status(201).json({ message: 'Reporte enviado con éxito', data: { id } });
});

module.exports = {
  crearReporte,
};