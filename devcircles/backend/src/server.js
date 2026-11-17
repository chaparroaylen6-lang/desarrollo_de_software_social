const app = require('./app');
const config = require('./config/env');
const { verificarConexion } = require('./config/db');

const MAX_INTENTOS = 5;
const ESPERA_MS = 3000;

async function conectarConReintentos() {
  let ultimoError;
  for (let i = 1; i <= MAX_INTENTOS; i++) {
    try {
      console.log(`Conectando a: ${config.db.host}:${config.db.port} (intento ${i}/${MAX_INTENTOS})`);
      await verificarConexion();
      return;
    } catch (err) {
      ultimoError = err;
      console.error(`[db] ❌ Intento ${i}/${MAX_INTENTOS} falló:`, err.code || err.message);
      if (i < MAX_INTENTOS) {
        await new Promise((resolve) => setTimeout(resolve, ESPERA_MS));
      }
    }
  }
  throw ultimoError;
}

(async () => {
  try {
    await conectarConReintentos();
    app.listen(config.port, () => {
      console.log(`[server]  DevCircles API corriendo en http://localhost:${config.port}/api`);
      console.log(`[server]    Entorno: ${config.nodeEnv}`);
    });
  } catch (err) {
    console.error('[server] ❌ No se pudo conectar a MySQL después de varios intentos:', err.code || err);
    process.exit(1);
  }
})();