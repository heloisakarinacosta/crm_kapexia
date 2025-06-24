const OpenAI = require('openai');

const API_BASE_URL = process.env.API_BASE_URL || 'https://crm.kapexia.com.br';

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
      let run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId
      });

      // Aguardar conclusão ou function_call
      let runStatus;
      let attempts = 0;
      const maxAttempts = 60;
      let functionCallHandled = false;
      do {
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        console.log('[DEBUG] Status do run:', runStatus.status, runStatus.required_action);
        if (runStatus.status === 'requires_action' && runStatus.required_action && runStatus.required_action.type === 'submit_tool_outputs') {
          // Function calling solicitado
          const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
          const toolOutputs = [];
          for (const toolCall of toolCalls) {
            if (toolCall.function.name === 'getConversasPorPeriodo') {
              // Executar chamada na API interna
              const args = JSON.parse(toolCall.function.arguments);
              const fetch = require('node-fetch');
              let url = `${API_BASE_URL}/api/contatos/conversas?period=${args.period}`;
              if (args.period === 'range' && args.start && args.end) {
                url += `&start=${args.start}&end=${args.end}`;
              }
              const apiRes = await fetch(url);
              const data = await apiRes.json();
              console.log('[DEBUG] Resposta da API getConversasPorPeriodo:', data);
              toolOutputs.push({
                tool_call_id: toolCall.id,
                output: JSON.stringify(data)
              });
            } else if (toolCall.function.name === 'getLeadsCountPorPeriodo') {
              // Executar chamada na API interna de leads
              const args = JSON.parse(toolCall.function.arguments);
              const fetch = require('node-fetch');
              let url = `${API_BASE_URL}/api/leads/count?period=${args.period}`;
              if (args.period === 'range' && args.start && args.end) {
                url += `&start=${args.start}&end=${args.end}`;
              }
              const apiRes = await fetch(url);
              const data = await apiRes.json();
              console.log('[DEBUG] Resposta da API getLeadsCountPorPeriodo:', data);
              let output = (data && data.result) ? data.result : { total: 0 };
              toolOutputs.push({
                tool_call_id: toolCall.id,
                output: JSON.stringify(output)
              });
            } else {
              toolOutputs.push({
                tool_call_id: toolCall.id,
                output: JSON.stringify({ error: 'Função não implementada' })
              });
            }
          }
          console.log('[DEBUG] Enviando tool_outputs para o Assistant:', JSON.stringify(toolOutputs, null, 2));
          // Enviar resultado da função para o assistant no formato Make.com
          const makeResults = toolOutputs.map(t => ({
            toolCallId: t.tool_call_id,
            result: t.output
          }));
          console.log('[DEBUG] Enviando results para o Assistant (padrão Make.com):', JSON.stringify({ results: makeResults }, null, 2));
          run = await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, { tool_outputs: toolOutputs });
          functionCallHandled = true;
        } else if (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
          await new Promise(resolve => setTimeout(resolve, 1000));
          attempts++;
        }
      } while ((runStatus.status === 'in_progress' || runStatus.status === 'queued' || (runStatus.status === 'requires_action' && !functionCallHandled)) && attempts < maxAttempts);

      if (runStatus.status === 'completed') {
        // Obter mensagens do thread
        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessage = messages.data[0];
        let responseText = lastMessage.content[0].text.value;
        try {
          const jsonResponse = JSON.parse(responseText);
          if (jsonResponse.response) {
            responseText = jsonResponse.response;
          }
        } catch (e) {}
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

