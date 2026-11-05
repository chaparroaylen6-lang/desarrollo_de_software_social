const MAX_LIMITE = 50;

/**
 * Extrae y sanitiza parámetros de paginación del query string.
 * Devuelve { pagina, limite, offset } para usar directo en MySQL.
 */
function parsearPaginacion(query) {
  const pagina = Math.max(1, parseInt(query.pagina, 10) || 1);
  const limite = Math.min(MAX_LIMITE, Math.max(1, parseInt(query.limite, 10) || 20));
  const offset = (pagina - 1) * limite;
  return { pagina, limite, offset };
}

/**
 * Arma el objeto meta que va en cada respuesta de lista.
 */
function metaPaginacion({ pagina, limite, total }) {
  return {
    pagina,
    limite,
    total,
    paginas: Math.ceil(total / limite),
  };
}

module.exports = { parsearPaginacion, metaPaginacion };
