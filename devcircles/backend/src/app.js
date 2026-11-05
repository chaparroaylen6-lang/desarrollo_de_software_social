const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const config = require('./config/env');
const errorMiddleware = require('./middlewares/error.middleware');
const routes = require('./routes');

const app = express();

// ── Seguridad ──────────────────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: config.cors.origin,
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