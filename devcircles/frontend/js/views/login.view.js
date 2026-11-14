import { iniciarSesion, registrar } from '../services/auth.service.js';
import { navegar } from '../router.js';
import { crear, vaciar, avisar } from '../utils/dom.js';

export function montarLogin(contenedor) {
  vaciar(contenedor);

  let modoRegistro = false;

  const titulo = crear('h2', { class: 'titulo-vista', text: 'Iniciar sesión' });
  const error = crear('p', { class: 'error-form', hidden: '' });

  const campoUsuario = crear('label', { class: 'campo' }, [
    crear('span', { text: 'Usuario' }),
    crear('input', { name: 'username', type: 'text', minlength: '3', maxlength: '30', placeholder: 'joaquin' }),
  ]);
  campoUsuario.hidden = true;

  const campoEmail = crear('label', { class: 'campo' }, [
    crear('span', { text: 'Email' }),
    crear('input', { name: 'email', type: 'email', required: '', placeholder: 'vos@mail.com' }),
  ]);

  const campoPassword = crear('label', { class: 'campo' }, [
    crear('span', { text: 'Contraseña' }),
    crear('input', { name: 'password', type: 'password', required: '', minlength: '8', placeholder: 'mínimo 8 caracteres' }),
  ]);

  const boton = crear('button', { type: 'submit', class: 'boton-primario', text: 'Entrar' });
  const cambiar = crear('button', {
    type: 'button',
    class: 'boton-texto',
    text: '¿No tenés cuenta? Registrate',
  });

  const form = crear('form', { class: 'tarjeta form-auth' }, [
    titulo, error, campoUsuario, campoEmail, campoPassword, boton, cambiar,
  ]);

  cambiar.addEventListener('click', () => {
    modoRegistro = !modoRegistro;
    titulo.textContent = modoRegistro ? 'Crear cuenta' : 'Iniciar sesión';
    boton.textContent = modoRegistro ? 'Registrarme' : 'Entrar';
    cambiar.textContent = modoRegistro ? '¿Ya tenés cuenta? Entrá' : '¿No tenés cuenta? Registrate';
    campoUsuario.hidden = !modoRegistro;
    form.elements.username.required = modoRegistro;
    error.hidden = true;
  });

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    error.hidden = true;
    boton.disabled = true;
    boton.textContent = 'Entrando...';

    const datos = {
      username: form.elements.username.value.trim(),
      email: form.elements.email.value.trim(),
      password: form.elements.password.value,
    };

    try {
      if (modoRegistro) await registrar(datos);
      else await iniciarSesion(datos);

      avisar(modoRegistro ? 'Cuenta creada, bienvenido' : 'Sesión iniciada', 'success');
      navegar('#/feed');
    } catch (fallo) {
      error.textContent = fallo.message;
      error.hidden = false;
    } finally {
      boton.disabled = false;
      boton.textContent = modoRegistro ? 'Registrarme' : 'Entrar';
    }
  });

  contenedor.append(form);
}
