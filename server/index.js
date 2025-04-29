const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const { connectToDatabase, sql } = require("./db");

connectToDatabase(); // Connect to Azure SQL

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Health check
app.get("/", (req, res) => {
  res.send("Fire Warden Tracker API is running!");
});

// Get all wardens
app.get("/api/wardens", async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query("SELECT * FROM fire_wardens ORDER BY timestamp DESC");
    res.json(result.recordset);
  } catch (err) {
    console.error("Fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch wardens" });
  }
});

// Add a new warden
app.post("/api/wardens", async (req, res) => {
  const { staff_number, first_name, last_name, location } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("staff_number", sql.VarChar(20), staff_number)
      .input("first_name", sql.VarChar(50), first_name)
      .input("last_name", sql.VarChar(50), last_name)
      .input("location", sql.VarChar(100), location)
      .query(`
        INSERT INTO fire_wardens (staff_number, first_name, last_name, location, time_logged)
        VALUES (@staff_number, @first_name, @last_name, @location, GETDATE())
      `);

    res.status(201).json({ message: "Fire warden added successfully!" });
  } catch (err) {
    console.error("Insert failed:", err);
    res.status(500).json({ error: "Failed to insert fire warden" });
  }
});

// Delete a warden
app.delete("/api/wardens/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    await request.input("id", sql.Int, id).query("DELETE FROM fire_wardens WHERE id = @id");
    res.json({ message: "Warden deleted successfully!" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ error: "Failed to delete warden" });
  }
});

// Update a warden
app.put("/api/wardens/:id", async (req, res) => {
  const { id } = req.params;
  const { staff_number, first_name, last_name, location } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, id)
      .input("staff_number", sql.VarChar(20), staff_number)
      .input("first_name", sql.VarChar(50), first_name)
      .input("last_name", sql.VarChar(50), last_name)
      .input("location", sql.VarChar(100), location)
      .query(`
        UPDATE fire_wardens
        SET staff_number = @staff_number,
            first_name = @first_name,
            last_name = @last_name,
            location = @location,
            time_logged = GETDATE()
        WHERE id = @id
      `);

    res.json({ message: "Warden updated successfully!" });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Failed to update warden" });
  }
});

// ✅ Secure user login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM users WHERE username = @username');

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.json({
      message: 'Login successful',
      role: user.role
    });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ error: 'Login error' });
  }
});

// ✅ Get all users
app.get('/api/users', async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query(`
      SELECT id, username, full_name, email, staff_number, role
      FROM users
      ORDER BY username
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ Add a new user
app.post('/api/users', async (req, res) => {
  const { username, password, full_name, email, staff_number, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const request = new sql.Request();
    await request
      .input('username', sql.VarChar(100), username)
      .input('password_hash', sql.VarChar(255), hashedPassword)
      .input('full_name', sql.VarChar(255), full_name)
      .input('email', sql.VarChar(255), email)
      .input('staff_number', sql.VarChar(50), staff_number)
      .input('role', sql.VarChar(20), role)
      .query(`
        INSERT INTO users (username, password_hash, full_name, email, staff_number, role)
        VALUES (@username, @password_hash, @full_name, @email, @staff_number, @role)
      `);

    res.status(201).json({ message: "User added successfully!" });
  } catch (err) {
    console.error("Insert user failed:", err);
    res.status(500).json({ error: "Failed to add user." });
  }
});

// ✅ Delete a user
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    await request.input('id', sql.Int, id).query("DELETE FROM users WHERE id = @id");
    res.json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Delete user failed:", err);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { full_name, email, staff_number, role } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, id)
      .input("full_name", sql.VarChar(255), full_name)
      .input("email", sql.VarChar(255), email)
      .input("staff_number", sql.VarChar(50), staff_number)
      .input("role", sql.VarChar(20), role)
      .query(`
        UPDATE users
        SET full_name = @full_name,
            email = @email,
            staff_number = @staff_number,
            role = @role
        WHERE id = @id
      `);

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Update user failed:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});
