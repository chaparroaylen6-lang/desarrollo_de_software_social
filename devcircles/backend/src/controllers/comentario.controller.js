const comentarioModel = require('../models/comentario.model');
const postModel = require('../models/post.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Listar comentarios de un post específico
const listarComentariosPorPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  
  // Verificamos que el post exista
  const post = await postModel.buscarPorId(postId);
  if (!post) throw new AppError('Post no encontrado', 404);

  const comentarios = await comentarioModel.listarPorPost(postId);
  res.json({ data: comentarios });
});

// Crear un comentario en un post
const crearComentario = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { contenido } = req.body;

  // Verificamos que el post exista
  const post = await postModel.buscarPorId(postId);
  if (!post) throw new AppError('Post no encontrado', 404);

  const id = await comentarioModel.crear({
    postId,
    usuarioId: req.usuario.id,
    contenido,
  });

  const nuevoComentario = await comentarioModel.buscarPorId(id);
  res.status(201).json({ data: nuevoComentario });
});

// Eliminar un comentario
const eliminarComentario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comentario = await comentarioModel.buscarPorId(id);
  if (!comentario) throw new AppError('Comentario no encontrado', 404);

  const esModerador = ['moderador', 'admin'].includes(req.usuario.rol);
  if (comentario.usuarioId !== req.usuario.id && !esModerador) {
    throw new AppError('No podés eliminar este comentario', 403);
  }

  await comentarioModel.eliminar(id);
  res.status(204).send();
});

module.exports = {
  listarComentariosPorPost,
  crearComentario,
  eliminarComentario,
};