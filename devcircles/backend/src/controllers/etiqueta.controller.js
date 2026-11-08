const etiquetaModel = require('../models/etiqueta.model');
const asyncHandler = require('../utils/asyncHandler');

const listarEtiquetas = asyncHandler(async (req, res) => {
  const etiquetas = await etiquetaModel.listarTodas();
  res.json({ data: etiquetas });
});

module.exports = {
  listarEtiquetas,
};