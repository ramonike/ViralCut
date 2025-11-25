import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

console.log("Testing database connection...");
const dbUrl = process.env.DATABASE_URL;
console.log("DATABASE_URL:", dbUrl ? dbUrl.replace(/:[^:@]*@/, ":****@") : "Undefined");

const pool = new Pool({
    connectionString: dbUrl,
    ssl: {
        rejectUnauthorized: false
    }
});

const db = drizzle(pool);

async function main() {
    try {
        console.log("Listing tables in public schema...");
        const result = await pool.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public';");
        console.log("Tables found:", result.rows.map(r => r.tablename));

        if (result.rows.length === 0) {
            console.log("WARNING: No tables found! Did you run the SQL?");
        }

        process.exit(0);
    } catch (error) {
        console.error("Database error message:", error.message);
        console.error("Full error:", error);
        process.exit(1);
    }
}

main();
