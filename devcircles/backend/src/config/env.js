require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT, 10) || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'devcircles',
    connectionLimit: parseInt(process.env.DB_POOL_SIZE, 10) || 10,
  },
  jwt: {
    secret:              process.env.JWT_SECRET          || 'dev_secret_inseguro',
    expiresIn:           process.env.JWT_EXPIRES_IN      || '15m',
    refreshExpiresDays:  parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS, 10) || 7,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5500',
  },
  maxBodySize: process.env.MAX_BODY_SIZE || '2mb',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900_000,
    max:      parseInt(process.env.RATE_LIMIT_MAX,        10) || 100,
  },
};

// Aviso en desarrollo si se usa el secreto inseguro por defecto
if (config.nodeEnv !== 'test' && config.jwt.secret === 'dev_secret_inseguro') {
  console.warn('[config] ⚠️  JWT_SECRET no configurado. Usá un valor seguro en .env');
}

module.exports = config;
