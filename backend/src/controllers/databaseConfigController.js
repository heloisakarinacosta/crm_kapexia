const DatabaseConfig = require('../models/databaseConfigModel');
const { validationResult } = require('express-validator');

const DatabaseConfigController = {
  // Obter configuração de BD por ID de cliente
  async getConfigByClientId(req, res) {
    try {
      const { clientId } = req.params;
      const config = await DatabaseConfig.findByClientId(clientId);
      
      if (!config) {
        return res.status(404).json({ 
          success: false, 
          message: 'Configuração de banco de dados não encontrada para este cliente' 
        });
      }
      
      // Não retornar a senha encriptada
      const configWithoutPassword = { ...config, password: '[ENCRYPTED]' };
      
      res.json({ success: true, data: configWithoutPassword });
    } catch (error) {
      console.error('Erro ao buscar configuração de BD:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar configuração de banco de dados', 
        error: error.message 
      });
    }
  },

  // Obter configuração de BD por ID
  async getConfigById(req, res) {
    try {
      const { id } = req.params;
      const config = await DatabaseConfig.findById(id);
      
      if (!config) {
        return res.status(404).json({ 
          success: false, 
          message: 'Configuração de banco de dados não encontrada' 
        });
      }
      
      // Não retornar a senha encriptada
      const configWithoutPassword = { ...config, password: '[ENCRYPTED]' };
      
      res.json({ success: true, data: configWithoutPassword });
    } catch (error) {
      console.error('Erro ao buscar configuração de BD:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar configuração de banco de dados', 
        error: error.message 
      });
    }
  },

  // Criar nova configuração de BD
  async createConfig(req, res) {
    try {
      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          message: 'Dados inválidos', 
          errors: errors.array() 
        });
      }
      
      const configData = {
        client_id: req.body.client_id,
        host: req.body.host,
        port: req.body.port,
        database_name: req.body.database_name,
        username: req.body.username,
        password: req.body.password,
        use_ssl: req.body.use_ssl,
        ssl_ca: req.body.ssl_ca,
        ssl_cert: req.body.ssl_cert,
        ssl_key: req.body.ssl_key,
        is_active: req.body.is_active,
        use_demo_data: req.body.use_demo_data
      };
      
      // Verificar se já existe configuração para este cliente
      const existingConfig = await DatabaseConfig.findByClientId(configData.client_id);
      if (existingConfig) {
        return res.status(400).json({ 
          success: false, 
          message: 'Já existe uma configuração de banco de dados para este cliente' 
        });
      }
      
      const newConfig = await DatabaseConfig.create(configData);
      
      res.status(201).json({ 
        success: true, 
        message: 'Configuração de banco de dados criada com sucesso', 
        data: newConfig 
      });
    } catch (error) {
      console.error('Erro ao criar configuração de BD:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erro ao criar configuração de banco de dados', 
        error: error.message 
      });
    }
  },

  // Atualizar configuração de BD existente
  async updateConfig(req, res) {
    try {
      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          message: 'Dados inválidos', 
          errors: errors.array() 
        });
      }
      
      const { id } = req.params;
      
      // Verificar se a configuração existe
      const existingConfig = await DatabaseConfig.findById(id);
      if (!existingConfig) {
        return res.status(404).json({ 
          success: false, 
          message: 'Configuração de banco de dados não encontrada' 
        });
      }
      
      const configData = {
        host: req.body.host,
        port: req.body.port,
        database_name: req.body.database_name,
        username: req.body.username,
        password: req.body.password, // Será encriptada no modelo se fornecida
        use_ssl: req.body.use_ssl,
        ssl_ca: req.body.ssl_ca,
        ssl_cert: req.body.ssl_cert,
        ssl_key: req.body.ssl_key,
        is_active: req.body.is_active,
        use_demo_data: req.body.use_demo_data
      };
      
      const updatedConfig = await DatabaseConfig.update(id, configData);
      
      res.json({ 
        success: true, 
        message: 'Configuração de banco de dados atualizada com sucesso', 
        data: updatedConfig 
      });
    } catch (error) {
      console.error('Erro ao atualizar configuração de BD:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erro ao atualizar configuração de banco de dados', 
        error: error.message 
      });
    }
  },

  // Excluir configuração de BD
  async deleteConfig(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se a configuração existe
      const existingConfig = await DatabaseConfig.findById(id);
      if (!existingConfig) {
        return res.status(404).json({ 
          success: false, 
          message: 'Configuração de banco de dados não encontrada' 
        });
      }
      
      await DatabaseConfig.delete(id);
      
      res.json({ 
        success: true, 
        message: 'Configuração de banco de dados excluída com sucesso' 
      });
    } catch (error) {
      console.error('Erro ao excluir configuração de BD:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erro ao excluir configuração de banco de dados', 
        error: error.message 
      });
    }
  },

  // Testar conexão com banco de dados
  async testConnection(req, res) {
    try {
      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          message: 'Dados inválidos', 
          errors: errors.array() 
        });
      }
      
      const configData = {
        host: req.body.host,
        port: req.body.port,
        database_name: req.body.database_name,
        username: req.body.username,
        password: req.body.password,
        use_ssl: req.body.use_ssl,
        ssl_ca: req.body.ssl_ca,
        ssl_cert: req.body.ssl_cert,
        ssl_key: req.body.ssl_key
      };
      
      const result = await DatabaseConfig.testConnection(configData);
      
      if (result.success) {
        res.json({ 
          success: true, 
          message: result.message 
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: result.message,
          error: result.error
        });
      }
    } catch (error) {
      console.error('Erro ao testar conexão com BD:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erro ao testar conexão com banco de dados', 
        error: error.message 
      });
    }
  }
};

module.exports = DatabaseConfigController;
