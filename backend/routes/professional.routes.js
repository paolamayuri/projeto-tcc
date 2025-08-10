// routes/professional.routes.js
const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professional.controller');
const { authenticateAdmin } = require('../middleware/auth.middleware');

// Rota pública
router.get('/professionals', professionalController.getAllProfessionals);

// Rotas de Admin
router.post('/admin/professionals', authenticateAdmin, professionalController.createProfessional);
router.put('/admin/professionals/:id', authenticateAdmin, professionalController.updateProfessional);
router.delete('/admin/professionals/:id', authenticateAdmin, professionalController.deleteProfessional);

module.exports = router;