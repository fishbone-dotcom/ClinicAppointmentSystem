const express = require('express');
const router = express.Router();
const {isBlank} = require('../helpers/common')
const Clinic = require('../models/clinics')
const sql = require('mssql');

router.post('/data_by_id', async (req, res) => {
  const conn = res.locals.conn
  let {id} = req.body

  let result = await conn.request()
    .input('id', sql.Int, id)
    .query(`SELECT Id, Name, Email, Address, Phone
            FROM tblClinics
            WHERE Id = @id`)

  res.json({data: result.recordset[0]})
})

router.post('/save', async (req, res) => {
    const conn = res.locals.conn
    let {masterFormData, id} = req.body
    let errorMessage
    const transaction = await conn.transaction()
    await transaction.begin()
    try {
        let clinic = new Clinic(transaction)
        if(isBlank(id)){
            let result = await clinic.insert(masterFormData)
            id = result.Id
            await clinic.checkDuplicate(id, masterFormData)
        }
        else{
            const params = [
                { name: 'id', type: sql.Int, value: id }
            ]

            await clinic.update(params, masterFormData, 'Id = @id')
        }

        await transaction.commit()
    } catch (error) {
        errorMessage = error.message
        await transaction.rollback()
    }
    finally{
        res.json({error_message: errorMessage})
    }
});

router.post('/delete', async (req, res) => {
    const conn = res.locals.conn
    let {id} = req.body
    let errorMessage
    const transaction = await conn.transaction()
    await transaction.begin()
    try {
        let clinic = new Clinic(transaction)

        await clinic.delete(id)
        await transaction.commit()
    } catch (error) {
        errorMessage = error.message
        await transaction.rollback()
    }
    finally{
        res.json({error_message: errorMessage})
    }
});

router.get('/get_clinic_look_ups', async (req, res) => {
  const conn = res.locals.conn

  let result = await conn.request()
    .query(`SELECT Id AS id, Name AS value
            FROM tblClinics
            ORDER BY Name`)

  res.json({data: result.recordset})
})

module.exports = router;
