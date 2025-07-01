const MSSqlAdapter = require('../helpers/msql_adapter')

class Appointment extends MSSqlAdapter {
    constructor(conn) {
        super(conn)
        this.tableName = 'tblAppointments'
        this.primaryKey = 'Id'
        this.modelName = 'Appointment'
    }
}

module.exports = Appointment