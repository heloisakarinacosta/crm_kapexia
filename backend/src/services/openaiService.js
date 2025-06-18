const OpenAI = require('openai');

const OpenAIService = {
  // Listar assistants disponíveis
  async listAssistants(apiKey) {
    try {
      const openai = new OpenAI({
        apiKey: apiKey
      });

      const assistants = await openai.beta.assistants.list({
        order: 'desc',
        limit: 100
      });

      return {
        success: true,
        data: assistants.data.map(assistant => ({
          id: assistant.id,
          name: assistant.name || 'Sem nome',
          description: assistant.description || '',
          model: assistant.model,
          created_at: assistant.created_at
        }))
      };
    } catch (error) {
      console.error('Erro ao listar assistants:', error);
      return {
        success: false,
        message: 'Erro ao conectar com OpenAI: ' + error.message
      };
    }
  },

  // Listar modelos disponíveis
  async listModels(apiKey) {
    try {
      const openai = new OpenAI({
        apiKey: apiKey
      });

      const models = await openai.models.list();
      
      // Filtrar apenas modelos de chat/completion
      const chatModels = models.data
        .filter(model => 
          model.id.includes('gpt') || 
          model.id.includes('text-davinci') ||
          model.id.includes('claude') ||
          model.id.includes('llama')
        )
        .sort((a, b) => a.id.localeCompare(b.id));

      return {
        success: true,
        data: chatModels.map(model => ({
          id: model.id,
          name: model.id,
          owned_by: model.owned_by,
          created: model.created
        }))
      };
    } catch (error) {
      console.error('Erro ao listar modelos:', error);
      return {
        success: false,
        message: 'Erro ao conectar com OpenAI: ' + error.message
      };
    }
  },

  // Enviar mensagem para assistant
  async sendToAssistant(apiKey, assistantId, message, threadId = null) {
    try {
      const openai = new OpenAI({
        apiKey: apiKey
      });

      // Criar ou usar thread existente
      let thread;
      if (threadId) {
        thread = await openai.beta.threads.retrieve(threadId);
      } else {
        thread = await openai.beta.threads.create();
      }

      // Adicionar mensagem ao thread
      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: message
      });

      // Executar assistant
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId
      });

      // Aguardar conclusão
      let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      }

      if (runStatus.status === 'completed') {
        // Obter mensagens do thread
        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessage = messages.data[0];

        return {
          success: true,
          data: {
            message: lastMessage.content[0].text.value,
            threadId: thread.id
          }
        };
      } else {
        return {
          success: false,
          message: 'Erro na execução do assistant: ' + runStatus.status
        };
      }
    } catch (error) {
      console.error('Erro ao enviar para assistant:', error);
      return {
        success: false,
        message: 'Erro ao comunicar com assistant: ' + error.message
      };
    }
  },

  // Enviar mensagem para completion
  async sendToCompletion(apiKey, model, message, systemPrompt = null) {
    try {
      const openai = new OpenAI({
        apiKey: apiKey
      });

      const messages = [];
      
      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt
        });
      }

      messages.push({
        role: 'user',
        content: message
      });

      const completion = await openai.chat.completions.create({
        model: model,
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      });

      return {
        success: true,
        data: {
          message: completion.choices[0].message.content
        }
      };
    } catch (error) {
      console.error('Erro ao enviar para completion:', error);
      return {
        success: false,
        message: 'Erro ao comunicar com OpenAI: ' + error.message
      };
    }
  }
};

module.exports = OpenAIService;

