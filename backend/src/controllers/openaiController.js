const OpenAIConfig = require('../models/openaiConfigModel');
const OpenAIService = require('../services/openaiService');
const { validationResult } = require('express-validator');

const OpenAIController = {
  // Obter configuração OpenAI por cliente
  async getConfigByClientId(req, res) {
    try {
      const clientId = req.user.client_id;
      
      if (!clientId) {
        return res.status(400).json({
          success: false,
          message: 'Cliente não associado ao usuário'
        });
      }

      const config = await OpenAIConfig.findByClientId(clientId);
      
      // Não retornar a API key completa por segurança
      if (config && config.api_key) {
        config.api_key = config.api_key.substring(0, 10) + '...';
      }
      
      res.json({
        success: true,
        data: config
      });
    } catch (error) {
      console.error('Erro ao buscar configuração OpenAI:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Criar ou atualizar configuração OpenAI
  async upsertConfig(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const clientId = req.user.client_id;
      
      if (!clientId) {
        return res.status(400).json({
          success: false,
          message: 'Cliente não associado ao usuário'
        });
      }

      const configData = {
        api_key: req.body.api_key,
        assistant_id: req.body.assistant_id,
        model: req.body.model,
        system_prompt: req.body.system_prompt,
        is_active: req.body.is_active
      };

      // Verificar se já existe configuração
      const existingConfig = await OpenAIConfig.findByClientId(clientId);
      
      let result;
      if (existingConfig) {
        result = await OpenAIConfig.update(clientId, configData);
      } else {
        configData.client_id = clientId;
        result = await OpenAIConfig.create(configData);
      }
      
      res.json({
        success: true,
        message: 'Configuração OpenAI salva com sucesso',
        data: result
      });
    } catch (error) {
      console.error('Erro ao salvar configuração OpenAI:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Excluir configuração OpenAI
  async deleteConfig(req, res) {
    try {
      const clientId = req.user.client_id;
      
      if (!clientId) {
        return res.status(400).json({
          success: false,
          message: 'Cliente não associado ao usuário'
        });
      }
      
      await OpenAIConfig.delete(clientId);
      
      res.json({
        success: true,
        message: 'Configuração OpenAI excluída com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir configuração OpenAI:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Listar assistants disponíveis
  async listAssistants(req, res) {
    try {
      const { api_key } = req.body;

      if (!api_key) {
        return res.status(400).json({
          success: false,
          message: 'API Key é obrigatória'
        });
      }

      const result = await OpenAIService.listAssistants(api_key);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Erro ao listar assistants:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Listar modelos disponíveis
  async listModels(req, res) {
    try {
      const { api_key } = req.body;

      if (!api_key) {
        return res.status(400).json({
          success: false,
          message: 'API Key é obrigatória'
        });
      }

      const result = await OpenAIService.listModels(api_key);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Erro ao listar modelos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Enviar mensagem para chat
  async sendMessage(req, res) {
    try {
      const clientId = req.user.client_id;
      const { message, threadId } = req.body;

      if (!clientId) {
        return res.status(400).json({
          success: false,
          message: 'Cliente não associado ao usuário'
        });
      }

      if (!message) {
        return res.status(400).json({
          success: false,
          message: 'Mensagem é obrigatória'
        });
      }

      // Buscar configuração OpenAI do cliente
      const config = await OpenAIConfig.findByClientId(clientId);
      
      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'Configuração OpenAI não encontrada para este cliente'
        });
      }

      if (!config.is_active) {
        return res.status(400).json({
          success: false,
          message: 'Configuração OpenAI está inativa'
        });
      }

      let result;

      // Usar assistant se configurado, senão usar completion
      if (config.assistant_id) {
        result = await OpenAIService.sendToAssistant(
          config.api_key,
          config.assistant_id,
          message,
          threadId
        );
      } else {
        result = await OpenAIService.sendToCompletion(
          config.api_key,
          config.model || 'gpt-4',
          message,
          config.system_prompt
        );
      }

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
};

module.exports = OpenAIController;

