const { pool } = require("../config/db");

const ChartConfig = {
  async findAll() {
    const [rows] = await pool.execute(
      "SELECT * FROM chart_configs ORDER BY client_id, chart_position"
    );
    return rows;
  },

  async findByClientId(clientId) {
    const [rows] = await pool.execute(
      "SELECT * FROM chart_configs WHERE client_id = ? ORDER BY chart_position",
      [clientId]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT * FROM chart_configs WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  async create(configData) {
    const { 
      client_id, 
      chart_name,
      chart_type, 
      chart_title, 
      database_config_id,
      sql_query, 
      x_axis_field,
      y_axis_field,
      is_active 
    } = configData;
    
    // Buscar a próxima posição disponível para o cliente
    const [positionResult] = await pool.execute(
      'SELECT COALESCE(MAX(chart_position), 0) + 1 as next_position FROM chart_configs WHERE client_id = ?',
      [client_id]
    );
    const chart_position = positionResult[0].next_position;
    
    const [result] = await pool.execute(
      `INSERT INTO chart_configs 
       (client_id, chart_position, chart_name, chart_type, chart_title, database_config_id, 
        sql_query, x_axis_field, y_axis_field, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [client_id, chart_position, chart_name, chart_type, chart_title, database_config_id, 
       sql_query, x_axis_field, y_axis_field, is_active !== undefined ? is_active : true]
    );
    
    return { id: result.insertId, chart_position, ...configData };
  },

  async update(id, configData) {
    const { 
      chart_name,
      chart_type, 
      chart_title, 
      database_config_id,
      sql_query, 
      x_axis_field,
      y_axis_field,
      is_active 
    } = configData;
    
    await pool.execute(
      `UPDATE chart_configs SET 
       chart_name = ?,
       chart_type = ?, 
       chart_title = ?, 
       database_config_id = ?,
       sql_query = ?, 
       x_axis_field = ?,
       y_axis_field = ?,
       is_active = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [chart_name, chart_type, chart_title, database_config_id, 
       sql_query, x_axis_field, y_axis_field, is_active !== undefined ? is_active : true, id]
    );
    
    return { id, ...configData };
  },

  async delete(id) {
    await pool.execute(
      "DELETE FROM chart_configs WHERE id = ?",
      [id]
    );
    
    return { id };
  },

  async validateSqlQuery(sql) {
    // Lista de palavras-chave proibidas para garantir segurança
    const forbiddenKeywords = [
      'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 
      'TRUNCATE', 'RENAME', 'REPLACE', 'GRANT', 'REVOKE', 'LOCK', 
      'UNLOCK', 'EXEC', 'EXECUTE', 'CALL', 'SHUTDOWN'
    ];
    
    // Verificar se a query contém palavras-chave proibidas
    const sqlUpper = sql.toUpperCase();
    for (const keyword of forbiddenKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(sqlUpper)) {
        return { 
          valid: false, 
          message: `Query contém palavra-chave não permitida: ${keyword}` 
        };
      }
    }
    
    // Verificar se a query começa com SELECT
    if (!sqlUpper.trim().startsWith('SELECT')) {
      return { 
        valid: false, 
        message: 'Query deve começar com SELECT' 
      };
    }
    
    return { valid: true, message: 'Query válida' };
  },

  async testSqlQuery(sql, clientId, databaseConfig = null) {
    try {
      // Primeiro validar a query
      const validation = await this.validateSqlQuery(sql);
      if (!validation.valid) {
        return validation;
      }
      
      // Se não tiver configuração de BD externa, usar dados de demonstração
      if (!databaseConfig || databaseConfig.use_demo_data) {
        // Executar a query na tabela de demonstração
        // Substituir os placeholders ? por clientId
        const sqlWithClientId = sql.replace(/\?/g, clientId);
        
        try {
          const [rows] = await pool.query(sqlWithClientId);
          return { 
            valid: true, 
            message: 'Query executada com sucesso', 
            data: rows,
            demo: true
          };
        } catch (error) {
          return { 
            valid: false, 
            message: `Erro ao executar query de demonstração: ${error.message}`,
            demo: true
          };
        }
      } else {
        // Conectar ao banco de dados externo e executar a query
        const mysql = require('mysql2/promise');
        
        const { host, port, database_name, username, password, use_ssl, ssl_ca, ssl_cert, ssl_key } = databaseConfig;
        
        const sslOptions = use_ssl ? {
          ca: ssl_ca,
          cert: ssl_cert,
          key: ssl_key
        } : undefined;
        
        const connection = await mysql.createConnection({
          host,
          port: port || 3306,
          database: database_name,
          user: username,
          password: require('./databaseConfigModel').decryptPassword(password),
          ssl: sslOptions,
          connectTimeout: 10000 // 10 segundos de timeout
        });
        
        try {
          const [rows] = await connection.query(sql, [clientId]);
          await connection.end();
          
          return { 
            valid: true, 
            message: 'Query executada com sucesso', 
            data: rows,
            demo: false
          };
        } catch (error) {
          await connection.end();
          return { 
            valid: false, 
            message: `Erro ao executar query no banco externo: ${error.message}`,
            demo: false
          };
        }
      }
    } catch (error) {
      return { 
        valid: false, 
        message: `Erro ao testar query: ${error.message}` 
      };
    }
  }
};

module.exports = ChartConfig;
