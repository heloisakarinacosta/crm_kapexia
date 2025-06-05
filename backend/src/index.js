// Arquivo index.js atualizado para o MVP2
// Este arquivo serve como ponto de entrada principal para manter compatibilidade com o MVP1
// Importa e utiliza as configurações do app.js

require("dotenv").config();
const app = require('./app'); // Importa as configurações do app.js

const PORT = process.env.PORT || 3002; // Força a porta 3002 para compatibilidade com o Nginx

// Inicia o servidor na porta especificada
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('MVP2 - Kapexia CRM Backend API');
});
