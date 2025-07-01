const MSSqlAdapter = require('../helpers/msql_adapter')

class Email extends MSSqlAdapter {
    constructor(conn) {
        super(conn)
        this.tableName = 'tblEmails'
        this.primaryKey = 'Id'
        this.modelName = 'Email'
    }
}

module.exports = Email