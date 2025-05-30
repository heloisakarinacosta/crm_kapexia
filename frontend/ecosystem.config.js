module.exports = {
  apps : [{
    name   : "crm-frontend",
    script : "./.next/standalone/server.js",
    env: {
      "PORT": 3001,
      "NODE_ENV": "production"
    }
  }]
}

