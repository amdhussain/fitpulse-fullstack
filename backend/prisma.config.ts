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

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   migrations: {
//     path: "prisma/migrations",
//   },
//   datasource: {
//     url: process.env["DATABASE_URL"],
//   },
// });


export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // এখানে আপনার TiDB-এর পুরো লিংকটি কোটেশনের ভেতর সরাসরি লিখে দিন
    // url: "mysql://2KMsKDzgeYKmCpS.root:uKee8Z11EvXAWjei@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/fitpulse_db?sslaccept=strict",
    url: process.env.DATABASE_URL,
  },
});