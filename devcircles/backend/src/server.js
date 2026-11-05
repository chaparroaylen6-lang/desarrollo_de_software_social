const app = require('./app');
const config = require('./config/env');
const { verificarConexion } = require('./config/db');

(async () => {
  try {
    await verificarConexion();
    app.listen(config.port, () => {
      console.log(`[server]  DevCircles API corriendo en http://localhost:${config.port}/api`);
      console.log(`[server]    Entorno: ${config.nodeEnv}`);
    });
  } catch (err) {
    console.error('[server] ❌ No se pudo conectar a MySQL:', err.message);
    process.exit(1);
  }
})();