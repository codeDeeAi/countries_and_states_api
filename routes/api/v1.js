const express = require('express');
const router = express.Router();
const PREFIX = '/api/v1/';
let allCountries = require('../../data/all.js');
const allowedCountryColumns = ['name', 'phoneCode', 'iso'];

/**
 * Builds a return object from a map function 
 * @param {Object} collection 
 * @param {Array} columnNames 
 * @returns {Object}
 */
const buildReturnObject = (collection, columnNames) => {
    let output = {};
    for (let index = 0; index < columnNames.length; index++) {
        const columnName = columnNames[index];
        output[columnName] = collection[columnName];
    }

    return output;
}

router.get(`${PREFIX}countries`, (req, res) => {
    let output = allCountries;
    if (req.query.columns) {
        let selectedColumns = [];
        req.query.columns.split(",").forEach(column => {
            if (allowedCountryColumns.includes(column)) {
                selectedColumns.push(column);
            }
        });

        output = allCountries.map((country) => {
            return {
                ...buildReturnObject(country, selectedColumns)
            }
        });
    }
    res.json(output).status(200);
})


module.exports = router;