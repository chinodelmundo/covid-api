const app = require('express')();
const PORT = process.env.PORT || 8080;
const express = require('express');
const XLSX = require('xlsx');
const db = require('./database');

app.listen(
	PORT,
	() => console.log(`it's alive on http://localhost:${PORT}`)
);

app.get('/top', (req, res, next)=> {
	const obsDate = req.query.observation_date;
	const maxResults = req.query.max_results;
	
	let error_msg = '';
	if(isNaN(parseInt(maxResults))) {
		error_msg += 'max_results should be an integer.\n';
	}
	
	if(isNaN(new Date(obsDate))) {
		error_msg += 'observation_date should be a date value.';
	}
	
	if(error_msg !== '') {
		res.status(400).send(error_msg);
	} else {
		db.getTop(obsDate, maxResults, (result) => {
			if(result) {
				let response = {
					observation_date: obsDate,
					countries: result.rows
				}
				res.status(200).send(response);
			} else {
				res.status(400).send('Error on query.');
			}
		});
	}
});

app.post('/', (req, res)=> {
	(async () => {
		let rowsCount =  await db.getTableRows();
		
		if(rowsCount > 0) {
			res.send('Table already has data.');
		} else {
			let data = parseCSV('./files/covid_19_data.csv');
			db.insertData(data[0].data, () => {
				res.status(200).send('Data has been inserted.');
			});
		}
	})();
});

app.delete('/', (req, res)=> {
	db.deleteData((result) => {
		if(result) {
			res.status(200).send('Data has been deleted.');
		} else {
			res.status(400).send('Error on delete query.');
		}
	});
});

const parseCSV = (filename) => {
	const csvData = XLSX.readFile(filename);
	
	return Object.keys(csvData.Sheets).map((name) => ({
		data: XLSX.utils.sheet_to_json(csvData.Sheets[name], {
		  raw: false,
		 })
	}));
};

(async () => {
	let rowsCount =  await db.getTableRows();
	
	if(rowsCount === 0) {
		let data = parseCSV('./files/covid_19_data.csv');
		db.insertData(data[0].data, () => {
			console.log('Data has been inserted.');
		});
	}
})();