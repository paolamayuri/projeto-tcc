// routes/appointment.routes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { authenticateToken, authenticateAdmin } = require('../middleware/auth.middleware');

// Rota pública (mas requer dados para consulta)
router.get('/availability', appointmentController.getAvailability);

// Rotas de usuário logado
router.post('/appointments', authenticateToken, appointmentController.createAppointment);
router.get('/appointments', authenticateToken, appointmentController.getUserAppointments);
router.delete('/appointments/:id', authenticateToken, appointmentController.deleteAppointment);

// Rotas de Admin
router.get('/admin/appointments', authenticateAdmin, appointmentController.getAllAppointmentsAdmin);
router.get('/admin/clients', authenticateAdmin, appointmentController.getAllClientsAdmin);

module.exports = router;