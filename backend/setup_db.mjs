import { getDb } from './db.mjs';

async function setupDatabase() {
    const db = await getDb();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    `);
    console.log('Database setup completed.');
}

setupDatabase().catch((err) => console.error(err));
