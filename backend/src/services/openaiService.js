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
      console.log('[DEBUG] sendToAssistant:', { assistantId, message, threadId, threadIdType: typeof threadId });
      
      const openai = new OpenAI({
        apiKey: apiKey
      });

      // Criar ou usar thread existente
      let thread;
      if (threadId && typeof threadId === 'string' && threadId !== 'undefined' && threadId.trim() !== '') {
        console.log('[DEBUG] Usando thread existente:', threadId);
        thread = await openai.beta.threads.retrieve(threadId);
      } else {
        console.log('[DEBUG] Criando novo thread');
        thread = await openai.beta.threads.create();
      }

      console.log('[DEBUG] Thread criado/recuperado:', { threadId: thread?.id, hasThread: !!thread });

      if (!thread || !thread.id) {
        throw new Error('Falha ao criar ou recuperar thread');
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

      console.log('[DEBUG] Run criado:', { runId: run?.id, threadId: thread.id });

      if (!run || !run.id) {
        throw new Error('Falha ao criar run');
      }

      console.log('[DEBUG] Antes de retrieve:', { threadId: thread.id, runId: run.id, threadIdType: typeof thread.id, runIdType: typeof run.id });

      // Aguardar conclusão com timeout
      let runStatus;
      let attempts = 0;
      const maxAttempts = 60; // 60 seconds timeout
      
      do {
        try {
          console.log('[DEBUG] Tentativa de retrieve:', attempts + 1);
          const threadIdToUse = thread.id;
          const runIdToUse = run.id;
          console.log('[DEBUG] IDs para usar:', { threadIdToUse, runIdToUse });
          
          runStatus = await openai.beta.threads.runs.retrieve(threadIdToUse, runIdToUse);
          console.log('[DEBUG] Status do run:', runStatus.status);
          
          if (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
          }
        } catch (error) {
          console.error('[DEBUG] Erro no retrieve:', error.message);
          throw error;
        }
      } while ((runStatus.status === 'in_progress' || runStatus.status === 'queued') && attempts < maxAttempts);

      if (runStatus.status === 'completed') {
        // Obter mensagens do thread
        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessage = messages.data[0];
        
        let responseText = lastMessage.content[0].text.value;
        
        // Tentar fazer parse do JSON se a resposta parecer ser um JSON
        try {
          const jsonResponse = JSON.parse(responseText);
          if (jsonResponse.response) {
            responseText = jsonResponse.response;
          }
        } catch (e) {
          // Se não for JSON válido, usar a resposta como está
          console.log('[DEBUG] Resposta não é JSON válido, usando como texto simples');
        }

        return {
          success: true,
          data: {
            message: responseText,
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

