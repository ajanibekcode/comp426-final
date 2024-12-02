import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

export async function getDb() {
    if (!db) {
        db = await open({
            filename: './db.sqlite',
            driver: sqlite3.Database,
        });
    }
    return db;
}
