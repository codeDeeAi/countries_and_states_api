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

    if (req.query.select) {
        let selectedCountries = req.query.select.split(",").map(element => {
            return element.toLowerCase();
        });

        output = output.filter((country) => {
            return (country.name && selectedCountries.includes(country.name.toLowerCase())) ||
                (country.phoneCode && selectedCountries.includes(country.phoneCode.toLowerCase())) ||
                (country.iso && selectedCountries.includes(country.iso.toLowerCase()));
        });
    }

    if (req.query.excludeByISO) {
        let excludedCountries = req.query.excludeByISO.split(",").map(element => {
            return element.toLowerCase();
        });

        output = output.filter((country) => {
            return (country.iso && !excludedCountries.includes(country.iso.toLowerCase()));
        });
    }

    if (req.query.excludeByName) {
        let excludedCountries = req.query.excludeByName.split(",").map(element => {
            return element.toLowerCase();
        });

        output = output.filter((country) => {
            return (country.name && !excludedCountries.includes(country.name.toLowerCase()));
        });
    }

    if (req.query.excludeByPhoneCode) {
        let excludedCountries = req.query.excludeByPhoneCode.split(",").map(element => {
            return element.toLowerCase();
        });

        output = output.filter((country) => {
            return (country.phoneCode && !excludedCountries.includes(country.phoneCode.toLowerCase()));
        });
    }

    res.json(output).status(200);
})


router.all('*', function(req, res) {
    res.json({ "error": "Resource not found" }).status(404);
});

module.exports = router;