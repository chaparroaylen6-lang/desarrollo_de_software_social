const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const config = require('./config/env');
const errorMiddleware = require('./middlewares/error.middleware');
const routes = require('./routes');

const app = express();
app.set('trust proxy', 1);

// ── Seguridad ──────────────────────────────────────────────────────────────
app.use(helmet());

// En desarrollo aceptamos cualquier dirección local (localhost o 127.0.0.1, con
// cualquier puerto): Live Server no siempre levanta en el mismo, y cada integrante
// del grupo puede tener uno distinto. En producción vale solo el origen del .env.
const ORIGEN_LOCAL = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

function validarOrigen(origen, callback) {
  // Sin cabecera Origin (Postman, curl, el propio servidor) no hay nada que bloquear
  if (!origen) return callback(null, true);
  if (origen === config.cors.origin) return callback(null, true);
  if (config.nodeEnv === 'development' && ORIGEN_LOCAL.test(origen)) return callback(null, true);
  return callback(new Error(`Origen no permitido por CORS: ${origen}`));
}

app.use(
  cors({
    origin: validarOrigen,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max:      config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders:   false,
    message: { error: 'Demasiadas solicitudes, intentá más tarde' },
  })
);

// ── Parseo del body ────────────────────────────────────────────────────────
app.use(express.json({ limit: config.maxBodySize }));

// ── Rutas ──────────────────────────────────────────────────────────────────
app.use('/api', routes);

// ── Errores ────────────────────────────────────────────────────────────────
// 404 para cualquier ruta no definida
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Manejador central — DEBE ir último y tener 4 parámetros
app.use(errorMiddleware);

module.exports = app;