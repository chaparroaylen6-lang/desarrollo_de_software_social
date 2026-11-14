import { api } from './api.js';

/**
 * Un solo endpoint sirve para dar y sacar el like: el backend decide
 * según si ya existía. Devuelve { message, liked }.
 */
export async function alternarLike(postId) {
  return api(`/posts/${postId}/likes`, { method: 'POST' });
}
