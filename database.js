const {Pool} = require('pg');
const pool = new Pool({
	host: process.env.HOST || '',
	port: '5432',
	user: process.env.USER || '',
	password: process.env.PASS || '',
	database: process.env.DB || '',
	max: 20,
	connectionTimeoutMillis: 0,
	idleTimeoutMillis: 0
});

module.exports.insertData = (data, callback) => {
	const insertQuery = `
		INSERT INTO covid_observations (
			observation_date,
			province_state,
			country_region,
			last_update,
			confirmed,
			deaths,
			recovered
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7
		)
	`;
	
	pool.connect((err, client) => {
		if(err) {
		  return console.error('connexion error', err);
		}
		
		data.forEach(row => {
			(async () => {
				await client.query(insertQuery, 
					[
						new Date(row.ObservationDate),
						row['Province/State'],
						row['Country/Region'],
						new Date(row['Last Update']),
						parseInt(row.Confirmed),
						parseInt(row.Deaths),
						parseInt(row.Recovered)
					], 
					(err, result) => {
						if(err) {
							return console.error('Error running query.', err);
						}
					}
				);
			})()
		});
		callback();
	});
};

module.exports.getTop = (obsDate, maxResults, callback) => {
	const selectQuery = `
			SELECT 
				country_region,
				SUM(confirmed) AS confirmed,
				SUM(deaths) AS deaths,
				SUM(recovered) AS recovered
			FROM covid_observations
			WHERE observation_date = $1
			GROUP BY country_region
			ORDER BY SUM(confirmed) DESC
			LIMIT $2;
		`;
		
	pool.connect((err, client) => {
		if(err) {
		  return console.error('connexion error', err);
		}
		
		client.query(selectQuery, 
			[
				obsDate,
				maxResults
			], 
			(err, result) => {
				if(err) {
					console.error('Error running query.', err);
				}
				
				callback(result);
			  
			}
		);
	});
}

module.exports.deleteData = (callback) => {
	pool.connect((err, client) => {
		if(err) {
		  return console.error('connexion error', err);
		}
		
		client.query(`DELETE FROM covid_observations`, 
			(err, result) => {
				if(err) {
					console.error('Error running query.', err);
				}
				
				callback(result);
			}
		);
	});
}

module.exports.getTableRows = () => {
    return new Promise(resolve => {
		pool.connect((err, client) => {
			if(err) {
			  return console.error('Connexion error', err);
			}
			
			client.query(`SELECT COUNT(*) FROM covid_observations`, 
				(err, result) => {
					if(err) {
						return console.error('Error running query.', err);
					}
					
					resolve(parseInt(result.rows[0].count));
				}
			);
		});
	});
};