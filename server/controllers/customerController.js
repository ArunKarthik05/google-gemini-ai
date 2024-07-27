import { connection } from "../database.js";

// Create (POST) - Add a new customer
export async function createCustomer(req, res) {
  const { name, phone, age, mail, gender } = req.body;

  // Validate required fields
  if (!name || !phone || !mail || !gender) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check for existing customer with the same name or mail
    const existingCustomerResult = await connection.query(
        'SELECT * FROM customers WHERE mail = $1',
        [mail]
      );
  
      if (existingCustomerResult.rowCount > 0) {
        return res.status(409).json({ error: 'Customer with this mail already exists' });
      }

    // Insert the new customer with optional age
    const result = await connection.query(
      'INSERT INTO customers (name, phone, age, mail, gender) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, phone, age || null, mail, gender] // Use null if age is not provided
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating customer', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Read (GET) - Retrieve all customers
export async function getCustomers(req, res) {
  try {
    const result = await connection.query('SELECT * FROM customers');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error retrieving customers', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}
