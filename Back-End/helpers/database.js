
const environment = process.env.NODE_ENV || 'development'

const _dbConfig = require('../config/database.json')[environment]
let dbConfig = {
  ..._dbConfig,
  database: {
    ..._dbConfig.database,
    user: process.env.DB_USERNAME || _dbConfig.database.user,
    password: process.env.DB_PASSWORD || _dbConfig.database.password,
    server: process.env.DB_HOST || _dbConfig.database.server,
    database: process.env.DB_NAME || _dbConfig.database.database,
    port: parseInt(process.env.DB_PORT || _dbConfig.database.port),
  }
}
const sql = require('mssql')

let connectionPools = []

async function connect(newDBConfig = undefined) {
  try {
    const config = newDBConfig || dbConfig.database
    const connectionName = getConnectionName(config)

    if (!connectionPools[connectionName]) {
      connectionPools[connectionName] = await new sql.ConnectionPool(config).connect()
    }

    return connectionPools[connectionName]
  }
  catch (err) {
    throw new Error('Error connecting to database server. Reason: ' + err.message)
  }
}

const getConnectionName = (config) => {
  return config.server + config.port.toString() + config.database
}

async function getConnection() {
  return await connect()
}

module.exports = {
  connect,
  getConnection
}