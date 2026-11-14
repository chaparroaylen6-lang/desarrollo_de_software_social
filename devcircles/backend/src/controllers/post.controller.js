const postModel = require('../models/post.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { parsearPaginacion, metaPaginacion } = require('../utils/paginacion');

const listarPosts = asyncHandler(async (req, res) => {
  const { limite, offset, pagina } = parsearPaginacion(req.query);
  const { tipo, etiqueta, orden } = req.query;

  const { posts, total } = await postModel.listar({ limite, offset, tipo, etiqueta, orden, usuarioId: req.usuario?.id ?? null });

  res.json({
    data: posts,
    meta: metaPaginacion({ pagina, limite, total }),
  });
});

const obtenerPost = asyncHandler(async (req, res) => {
  const post = await postModel.buscarPorId(req.params.id, req.usuario?.id ?? null);
  if (!post) throw new AppError('Post no encontrado', 404);
  res.json({ data: post });
});

const crearPost = asyncHandler(async (req, res) => {
  const { tipo, titulo, contenido, etiquetas, lenguaje, codigo, nombre_archivo } = req.body;
  const id = await postModel.crear({
    usuario_id: req.usuario.id,
    tipo,
    titulo,
    contenido,
    etiquetas,
    lenguaje,
    codigo,
    nombre_archivo,
  });
  const post = await postModel.buscarPorId(id);
  res.status(201).json({ data: post });
});

const editarPost = asyncHandler(async (req, res) => {
  const post = await postModel.buscarPorId(req.params.id);
  if (!post) throw new AppError('Post no encontrado', 404);

  const esModerador = ['moderador', 'admin'].includes(req.usuario.rol);
  if (post.usuario_id !== req.usuario.id && !esModerador) {
    throw new AppError('No podés editar este post', 403);
  }

  await postModel.actualizar(req.params.id, req.body);
  const actualizado = await postModel.buscarPorId(req.params.id);
  res.json({ data: actualizado });
});

const eliminarPost = asyncHandler(async (req, res) => {
  const post = await postModel.buscarPorId(req.params.id);
  if (!post) throw new AppError('Post no encontrado', 404);

  const esModerador = ['moderador', 'admin'].includes(req.usuario.rol);
  if (post.usuario_id !== req.usuario.id && !esModerador) {
    throw new AppError('No podés eliminar este post', 403);
  }

  await postModel.eliminar(req.params.id);
  res.status(204).send();
});

module.exports = { listarPosts, obtenerPost, crearPost, editarPost, eliminarPost };
