const jwt = require('jsonwebtoken');
const config = require('../config/env');

const firmar = (payload) =>
  jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

const verificar = (token) =>
  jwt.verify(token, config.jwt.secret); // lanza JsonWebTokenError si es inválido

module.exports = { firmar, verificar };
