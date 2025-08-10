// server.js (VERSÃO FINAL ORGANIZADA)

// --- Importações ---
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// --- Configuração Inicial ---
const app = express();
const PORT = 3001;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Conexão com o Banco de Dados ---
require('./configuracoes/database');

// --- Importação das Rotas ---
const authRoutes = require('./rotas/auth.routes');
const serviceRoutes = require('./rotas/service.routes');
const professionalRoutes = require('./rotas/professional.routes');
const appointmentRoutes = require('./rotas/appointment.routes');
const userRoutes = require('./rotas/user.routes');

// --- Uso das Rotas ---
// O Express vai direcionar as requisições para os arquivos de rota corretos
app.use('/api', authRoutes);
app.use('/api', serviceRoutes);
app.use('/api', professionalRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', userRoutes);

// --- Inicia o Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});