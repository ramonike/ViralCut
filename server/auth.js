import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { user, session, account, verification } from "./db/schema.js";
import dotenv from "dotenv";

dotenv.config();

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: { user, session, account, verification },
    }),
    emailAndPassword: {
        enabled: true
    },
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"]
});
