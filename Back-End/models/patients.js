const MSSqlAdapter = require('../helpers/msql_adapter')

class Patient extends MSSqlAdapter {
    constructor(conn) {
        super(conn)
        this.tableName = 'tblPatients'
        this.primaryKey = 'Id'
        this.modelName = 'Patient'
    }
}

module.exports = Patient