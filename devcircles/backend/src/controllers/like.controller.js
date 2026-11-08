const likeModel = require('../models/like.model');
const postModel = require('../models/post.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Alternar like (dar like si no existe, o quitarlo si ya existe - comportamiento tipo "toggle")
const toggleLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const usuarioId = req.usuario.id;

  // Verificamos que el post exista
  const post = await postModel.buscarPorId(postId);
  if (!post) throw new AppError('Post no encontrado', 404);

  // Verificamos si ya le dio like previamente
  const yaDioLike = await likeModel.existe(usuarioId, postId);

  if (yaDioLike) {
    await likeModel.eliminar(usuarioId, postId);
    res.json({ message: 'Like eliminado con éxito', liked: false });
  } else {
    await likeModel.crear(usuarioId, postId);
    res.status(201).json({ message: 'Like registrado con éxito', liked: true });
  }
});

module.exports = {
  toggleLike,
};
