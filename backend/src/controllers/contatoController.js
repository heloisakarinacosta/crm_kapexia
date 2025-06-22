const ContatoModel = require('../models/contatoModel');

const getConversasPorPeriodo = async (req, res) => {
  try {
    const { period, start, end } = req.query;
    const results = await ContatoModel.getConversasPorPeriodo({ period, start, end });
    // Resposta no padrão MCP
    res.json({
      context: 'conversas_por_lead',
      period,
      start,
      end,
      results
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getConversasPorPeriodo
}; 