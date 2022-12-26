const express = require('express');
const router = express.Router();
const PREFIX = '/api/v1/';
const { countries, states, findStates } = require('../../data/all.js');
const allowedCountryColumns = ['name', 'phoneCode', 'iso', 'capital', 'currency', 'primaryLanguages'];
const allowedStateColumns = ['name', 'iso', 'licensePlateCode', 'capital', 'area'];
const sortByDirection = require('../../config/sort');

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
    let output = countries;
    if (req.query.columns) {
        let selectedColumns = [];
        req.query.columns.split(",").forEach(column => {
            if (allowedCountryColumns.includes(column)) {
                selectedColumns.push(column);
            }
        });

        output = countries.map((country) => {
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

    if (req.query.sort && ['asc', 'desc'].includes(req.query.sort.toLowerCase())) {
        if (output.length > 0) {
            if (output[0].hasOwnProperty('name')) {
                output = sortByDirection('name', req.query.sort.toLowerCase(), output);
            }
        }
    }

    res.json(output).status(200);
});

router.get(`${PREFIX}states/:country`, (req, res) => {
    let output = findStates(req.params.country);
    if (req.query.columns) {
        let selectedColumns = [];
        req.query.columns.split(",").forEach(column => {
            if (allowedStateColumns.includes(column)) {
                selectedColumns.push(column);
            }
        });

        output = output.map((state) => {
            return {
                ...buildReturnObject(state, selectedColumns)
            }
        });
    }

    if (req.query.select) {
        let selectedStates = req.query.select.split(",").map(element => {
            return element.toLowerCase();
        });

        output = output.filter((state) => {
            return (state.name && selectedStates.includes(state.name.toLowerCase())) ||
                (state.licensePlateCode && selectedStates.includes(state.licensePlateCode.toLowerCase())) ||
                (state.iso && selectedStates.includes(state.iso.toLowerCase()));
        });
    }

    if (req.query.excludeByISO) {
        let excludedStates = req.query.excludeByISO.split(",").map(element => {
            return element.toLowerCase();
        });

        output = output.filter((state) => {
            return (state.iso && !excludedStates.includes(state.iso.toLowerCase()));
        });
    }

    if (req.query.excludeByName) {
        let excludedStates = req.query.excludeByName.split(",").map(element => {
            return element.toLowerCase();
        });

        output = output.filter((state) => {
            return (state.name && !excludedStates.includes(state.name.toLowerCase()));
        });
    }

    if (req.query.sort && ['asc', 'desc'].includes(req.query.sort.toLowerCase())) {
        if (output.length > 0) {
            if (output[0].hasOwnProperty('name')) {
                output = sortByDirection('name', req.query.sort.toLowerCase(), output);
            }
        }
    }

    res.json(output).status(200);
});


router.all('*', function(req, res) {
    res.json({ "error": "Resource not found" }).status(404);
});

module.exports = router;