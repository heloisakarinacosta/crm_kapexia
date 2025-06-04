const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const DatabaseConfigController = require('../controllers/databaseConfigController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Middleware para verificar se o utilizador está autenticado
router.use(authMiddleware);

// Rotas que requerem privilégios de administrador
router.use(adminMiddleware);

// Obter configuração de BD por ID de cliente
router.get('/client/:clientId', DatabaseConfigController.getConfigByClientId);

// Obter configuração de BD por ID
router.get('/:id', DatabaseConfigController.getConfigById);

// Criar nova configuração de BD
router.post('/', [
  body('client_id').isNumeric().withMessage('ID do cliente inválido'),
  body('host').notEmpty().withMessage('Host é obrigatório'),
  body('database_name').notEmpty().withMessage('Nome da base de dados é obrigatório'),
  body('username').notEmpty().withMessage('Nome de utilizador é obrigatório'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
], DatabaseConfigController.createConfig);

// Atualizar configuração de BD existente
router.put('/:id', [
  body('host').notEmpty().withMessage('Host é obrigatório'),
  body('database_name').notEmpty().withMessage('Nome da base de dados é obrigatório'),
  body('username').notEmpty().withMessage('Nome de utilizador é obrigatório')
], DatabaseConfigController.updateConfig);

// Excluir configuração de BD
router.delete('/:id', DatabaseConfigController.deleteConfig);

// Testar conexão com banco de dados
router.post('/test-connection', [
  body('host').notEmpty().withMessage('Host é obrigatório'),
  body('database_name').notEmpty().withMessage('Nome da base de dados é obrigatório'),
  body('username').notEmpty().withMessage('Nome de utilizador é obrigatório'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
], DatabaseConfigController.testConnection);

module.exports = router;
