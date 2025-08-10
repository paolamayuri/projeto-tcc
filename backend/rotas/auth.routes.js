// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controladores/auth.controller');

// Define as rotas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Exporta o roteador
module.exports = router;