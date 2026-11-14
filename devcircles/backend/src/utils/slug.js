/**
 * Convierte el nombre de una etiqueta en un slug seguro para URLs:
 * "Node JS" -> "node-js", "Programación" -> "programacion".
 */
const slugify = (texto) =>
  String(texto)
    .normalize('NFD')               // separa las tildes de las letras
    .replace(/[̀-ͯ]/g, '') // y las borra
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')    // todo lo que no sea letra o número pasa a guión
    .replace(/^-+|-+$/g, '');       // sin guiones sueltos en las puntas

module.exports = { slugify };
