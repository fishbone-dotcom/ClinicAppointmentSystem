const MSSqlAdapter = require('../helpers/msql_adapter')

class User extends MSSqlAdapter {
    constructor(conn) {
        super(conn)
        this.tableName = 'tblUsers'
        this.primaryKey = 'Id'
        this.modelName = 'User'
    }
}

module.exports = User