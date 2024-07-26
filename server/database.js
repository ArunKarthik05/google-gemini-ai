import Client from "pg/lib/client.js";
import "dotenv/config";

export const connection = new Client({
  connectionString: process.env.DB_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  }
});

const dropValuesQuery = `
  DELETE FROM products;
`;

const alterTableQuery = `
  ALTER TABLE products
  ADD CONSTRAINT unique_product_name UNIQUE (product_name);
`;

const selectRowsQuery = `
  SELECT * FROM products;
`;


async function main() {
  try {
    await connection.connect();
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('Error', err.stack);
  }
}

main();
