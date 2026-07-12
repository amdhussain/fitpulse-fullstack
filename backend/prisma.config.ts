import "dotenv/config";
import { defineConfig } from "prisma/config";

// ─── Prisma Configuration ─────────────────────────────────
// This file configures how Prisma interacts with the project.
// It reads DATABASE_URL from the .env file via dotenv.
//
// DO NOT modify this file unless you need to change:
//   - Schema location
//   - Migration output path
//   - Datasource URL override
// ───────────────────────────────────────────────────────────

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
