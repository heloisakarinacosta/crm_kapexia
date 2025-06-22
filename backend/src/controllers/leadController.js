const LeadModel = require('../models/leadModel');

const getLeadsCountPorPeriodo = async (req, res) => {
  try {
    const { period, start, end } = req.query;
    const result = await LeadModel.getLeadsCountPorPeriodo({ period, start, end });
    // Resposta no padrão MCP
    res.json({
      context: 'leads_count',
      period,
      start,
      end,
      result
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getLeadsCountPorPeriodo
}; 