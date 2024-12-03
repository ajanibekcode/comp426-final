const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let db;

async function getDb() {
    if (!db) {
        db = await open({
            filename: './db.sqlite',
            driver: sqlite3.Database,
        });
    }
    return db;
}

module.exports = { getDb };