require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

function createPrismaClient() {
  const dbUrl = new URL(process.env.DATABASE_URL);

  const adapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port, 10) || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.replace(/^\//, ""),
    connectionLimit: 5,
  });

  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✓ Database connected successfully!");
  } catch (error) {
    console.error("✗ Database connection failed!");
    console.error("  Error code:", error.code);
    console.error("  Message   :", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
