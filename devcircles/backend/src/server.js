const fs = require('fs');
const path = require('path');

const app = require('./app');
const config = require('./config/env');
const { pool, verificarConexion } = require('./config/db');

const MAX_INTENTOS = 5;
const ESPERA_MS = 3000;

async function conectarConReintentos() {
  let ultimoError;
  for (let i = 1; i <= MAX_INTENTOS; i++) {
    try {
      console.log('Credenciales leídas:', { user: config.db.user, db: config.db.database, passLen: config.db.password ? config.db.password.length : 0, passStart: config.db.password ? config.db.password.slice(0, 3) : '' });;
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

async function inicializarTablas() {
  try {
    const [rows] = await pool.query('SHOW TABLES');
    if (rows.length > 0) {
      console.log('[db] Las tablas ya existen, omitiendo schema/seed.');
      return;
    }

    console.log('[db] Creando tablas desde schema.sql...');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8')
      .replace(/CREATE DATABASE.*?;/gi, '')
      .replace(/USE\s+`?devcircles`?\s*;/gi, 'USE railway;');

    for (const stmt of schema.split(';')) {
      if (stmt.trim()) await pool.query(stmt);
    }
    console.log('[db] ✅ schema.sql ejecutado');

    const seedPath = path.join(__dirname, '../database/seed.sql');
    if (fs.existsSync(seedPath)) {
      const seed = fs.readFileSync(seedPath, 'utf8')
        .replace(/USE\s+`?devcircles`?\s*;/gi, 'USE railway;');
      for (const stmt of seed.split(';')) {
        if (stmt.trim()) await pool.query(stmt);
      }
      console.log('[db] ✅ seed.sql ejecutado');
    }
  } catch (err) {
    console.error('[db] ❌ Error al inicializar tablas:', err.message);
  }
}

(async () => {
  try {
    await conectarConReintentos();
    await inicializarTablas();
    app.listen(config.port, () => {
      console.log(`[server]  DevCircles API corriendo en http://localhost:${config.port}/api`);
      console.log(`[server]    Entorno: ${config.nodeEnv}`);
    });
  } catch (err) {
    console.error('[server] ❌ No se pudo conectar a MySQL después de varios intentos:', err.code || err);
    process.exit(1);
  }
})();