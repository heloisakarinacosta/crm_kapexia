module.exports = {
  apps : [{
    name   : "crm-frontend",
    script : "npm", // Usar npm para executar o script start
    args   : "run start", // Argumento para npm: executar o script 'start'
    env: {
      "PORT": 3001, // O script 'start' (next start) usará esta porta
      "NODE_ENV": "production"
    }
  }]
}

