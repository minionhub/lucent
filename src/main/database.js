const sqlite3 = require('sqlite3').verbose();

function openDatabase(dbPath) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error('Error opening database', err.message);
        reject(err);
      } else {
        console.log('Successfully opened the database');
        resolve(db);
      }
    });
  });
}

function fetchMessagesFromDb(db) {
  return new Promise((resolve, reject) => {
    const query = `SELECT account, date, text FROM message;`;
    db.all(query, [], (err, rows) => {
      db.close(); // It's important to close the database connection
      if (err) {
        console.error('Error fetching data from message table', err.message);
        reject(err);
      } else {
        console.log('Rows fetched from message table:', rows);
        resolve(rows);
      }
    });
  });
}

function fetchMessages(dbPath) {
  return openDatabase(dbPath)
    .then(fetchMessagesFromDb)
    .catch(err => {
      console.error('An error occurred:', err.message);
      throw err; // Rethrow or handle the error as needed
    });
}


function fetchCallsFromDb(db) {
  return new Promise((resolve, reject) => {
    const query = `SELECT ZDATE, ZADDRESS FROM ZCALLRECORD;`;
    db.all(query, [], (err, rows) => {
      db.close(); // It's important to close the database connection
      if (err) {
        console.error('Error fetching data from message table', err.message);
        reject(err);
      } else {
        console.log('Rows fetched from message table:', rows);
        resolve(rows);
      }
    });
  });
}

function fetchCalls(dbPath) {
  return openDatabase(dbPath)
    .then(fetchCallsFromDb)
    .catch(err => {
      console.error('An error occurred:', err.message);
      throw err; // Rethrow or handle the error as needed
    });
}

module.exports = { fetchMessages, fetchCalls };
