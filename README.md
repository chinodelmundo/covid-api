# Covid-API

API to get the top countries with confirmed cases

Demo: 
https://covid-observations.herokuapp.com/top?observation_date=2020-02-24&max_results=4

(only 10,000 rows were inserted due to free tier limit)

## Requirements:
- Node.js
- PostgreSQL
- Postman (or other API testing tool)

## Instructions
1. Clone or Download Zip and unzip the project.
2. Open command line on the project path.
3. Use 'npm install' to get the dependecies.
3. Open the create_table.sql file and run it on your database to create covid_observations table.
5. Open database.js and update the top values using your Database credentials.
- Update empty string ('') for host, user, password, database
6. Run 'node .' on the command line.
- If covid_observations table has no rows, data will be inserted after running this command

7. Use Postman to test the API.

## API
```
  GET /top/confirmed?observation_date=yyyy-mm-dd&max_results=n
```
- This will return a list of 'n' number of countries with top confirmed cases for that day.


```
  DELETE /
```
- This will delete the table data for covid_observations


```
  POST /
```
- This will insert the data from 'covid_19_data.csv' found in the files folder.
