// Atualiza o app.js para incluir as novas rotas do MVP2

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
// Importar rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const chartConfigRoutes = require('./routes/chartConfigRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const openaiRoutes = require('./routes/openaiRoutes');
const ragRoutes = require('./routes/ragRoutes');
const contatoRoutes = require('./routes/contatoRoutes');
const leadRoutes = require('./routes/leadRoutes');

const app = express();

// Configurações de segurança
app.use(helmet());
app.use(cors({
  origin: ['https://crm.kapexia.com.br', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Limitar requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por IP
});
app.use(limiter);

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.originalUrl}`);
  next();
});

// Basic Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Kapexia CRM Backend API!" });
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/chart-configs', chartConfigRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/openai', openaiRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/contatos', contatoRoutes);
app.use('/api/leads', leadRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando corretamente' });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

module.exports = app;
