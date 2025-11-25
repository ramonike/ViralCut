import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

console.log("Testing connection with postgres.js...");
const dbUrl = process.env.DATABASE_URL;
console.log("URL:", dbUrl ? dbUrl.replace(/:[^:@]*@/, ":****@") : "Undefined");

const sql = postgres(dbUrl, {
    ssl: 'require',
    prepare: false, // Disable prepared statements for Transaction mode
});

async function main() {
    try {
        console.log("Listing tables...");
        const result = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
        console.log("Tables found:", result.map(r => r.tablename));
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

main();
