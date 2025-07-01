class MSSQLAdapter {
    constructor(conn) {
        this._conn = conn
        this.tableName = ''
        this.primaryKey = ''
        this.modelName = ''
	}

    getConnection() {
		return this._conn
	}

    async insert(attributes) {
		let columns = []
		let values = []

		delete attributes[this.primaryKey]

		for (let name in attributes) {
			columns.push(name)
			values.push(this.renderAttributeValue(attributes[name]))
		}

		let insertSQL = `INSERT INTO ${this.tableName} (${columns.toString()})`
		let valueSQL = `VALUES (${values.toString()})`

		const request = await this._conn.request()
			.query(insertSQL + ' ' + valueSQL + ' SELECT SCOPE_IDENTITY() AS Id')

		if (request.recordset.length > 0) {
			attributes[this.primaryKey] = request.recordset[0].Id
		}

		return attributes
	}

	async update(id, attributes, whereCondition) {
		delete attributes[this.primaryKey]
   
		let values = []

		for (let name in attributes) {
			let value = ''
			value = this.renderAttributeValue(attributes[name])
			values.push(`${name} = ${value}`)
		}

		if (Array.isArray(id)) {
			let request = this._conn.request()

			for (let i = 0; i < id.length; i++) {
				request.input(id[i].name, id[i].type, id[i].value)
			}

			await request.query(`UPDATE ${this.tableName} SET ${values.toString()} WHERE ${whereCondition}`)
		}
		else {
			const request = await this._conn.request()
				.input('id', id)
				.query(`UPDATE ${this.tableName} SET ${values.toString()} WHERE ${this.primaryKey} = @id`)
		}
	}

	async delete(id, whereCondition) {
		if (Array.isArray(id)) {
			let request = this._conn.request()

			for (let i = 0; i < id.length; i++) {
				request.input(id[i].name, id[i].type, id[i].value)
			}

			await request.query(`DELETE FROM ${this.tableName} WHERE ${whereCondition}`)
		}
		else {
			const request = await this._conn.request()
				.input('id', id)
				.query(`DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = @id`)
		}
	}


	async checkDuplicate(id, attributes) {
		delete attributes[this.primaryKey]
		let values = []

    	let counter = 1
		for (let name in attributes) {

			let value = ''
			value = this.renderAttributeValue(attributes[name])
			if (counter < Object.keys(attributes).length) {
				values.push(`${name} = ${value} AND`)
			}
			else {
				values.push(`${name} = ${value}`)
			}
			counter++
		}

		const request = await this._conn.request()
		.input('id', id)
		.query(`SELECT * FROM ${this.tableName} WHERE ${values.toString().replace(/AND,/g, 'AND ')} AND id <> @id`)

		if (request.recordset.length > 0 && values.length > 0) {
		throw new Error(`${this.modelName} ${values[0].toString()} is already being used in the database.`)
		}
	}

	renderAttributeValue(value) {
		if (value == null) {
			return `null`
		}

		if (typeof value === 'string') {
			let v = value.replace(/'/g, `''`)
			return `'${v}'`
		}
		else if (typeof value === 'boolean') {
			return this.toSQLBoolean(value)
		}

		return value
	}

	toSQLBoolean(value) {
		if (value === true || value === '1' || value === 1 || value.toString().toLowerCase() === 'true')
			return 1
		else if (value === false || value === '0' || value === 0 || value.toString().toLowerCase() === 'false')
			return 0
		else
			return value
	}
}

module.exports = MSSQLAdapter