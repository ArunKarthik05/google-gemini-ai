import Client from "pg/lib/client.js";
import "dotenv/config";

export const connection = new Client({
  connectionString: process.env.DB_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  }
});

const createOrdersTable = `
 CREATE TABLE IF NOT EXISTS orders (
          order_id SERIAL PRIMARY KEY,
          customer_id INT,
          total DECIMAL(10, 2),
          order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
`;

const createOrderItemsTable = `
CREATE TABLE IF NOT EXISTS order_items (
  order_item_id SERIAL PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
`;

const createCustomersTable = `
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  age INT CHECK (age >= 0),
  gender VARCHAR NOT NULL,
  mail VARCHAR(255) UNIQUE NOT NULL 
)
`

const dropValuesQuery = `
  DELETE FROM order_items;
`;

const alterTableQuery = `
ALTER TABLE order_items
ADD CONSTRAINT order_id_fk
FOREIGN KEY (order_id) REFERENCES orders(order_id);
`;

const selectRowsQuery = `
  SELECT * FROM customers;
`;

const desQquery = `
    SELECT column_name, data_type, character_maximum_length, is_nullable
    FROM information_schema.columns
    WHERE table_name = $1;
  `;


async function main() {
  try {
    await connection.connect();
    console.log('Connected to PostgreSQL');
    // const result = await connection.query(desQquery, ["order_items"]);
    // console.table(result.rows);
    // const res = await connection.query(dropValuesQuery);
    // console.log("Dropped");
  } catch (err) {
    console.error('Error', err.stack);
  }
}
main();