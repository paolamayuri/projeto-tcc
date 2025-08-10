// routes/service.routes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controladores/service.controller');
const { authenticateAdmin } = require('../intermediarios/auth.middleware');

// Rota pública para listar todos os serviços
router.get('/services', serviceController.getAllServices);

// Rotas de admin, protegidas pelo middleware authenticateAdmin
router.post('/admin/services', authenticateAdmin, serviceController.createService);
router.put('/admin/services/:id', authenticateAdmin, serviceController.updateService);
router.delete('/admin/services/:id', authenticateAdmin, serviceController.deleteService);

module.exports = router;