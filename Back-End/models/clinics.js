const MSSqlAdapter = require('../helpers/msql_adapter')

class Clinic extends MSSqlAdapter {
    constructor(conn) {
        super(conn)
        this.tableName = 'tblClinics'
        this.primaryKey = 'Id'
        this.modelName = 'Clinic'
    }
}

module.exports = Clinic