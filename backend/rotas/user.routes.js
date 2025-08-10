// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controladores/user.controller');
// Esta linha abaixo é a crucial
const { authenticateToken } = require('../intermediarios/auth.middleware');

// A rota precisa do middleware de autenticação
router.put('/users/:id', authenticateToken, userController.updateUser);

module.exports = router;