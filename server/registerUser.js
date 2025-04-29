const bcrypt = require('bcrypt');
const { connectToDatabase, sql } = require('./db');

async function registerUser(username, password, role = 'warden') {
  try {
    await connectToDatabase();

    const hashedPassword = await bcrypt.hash(password, 10);
    const request = new sql.Request();
    await request
      .input('username', sql.VarChar, username)
      .input('password_hash', sql.VarChar, hashedPassword)
      .input('role', sql.VarChar, role)
      .query(`
        INSERT INTO users (username, password_hash, role)
        VALUES (@username, @password_hash, @role)
      `);

    console.log(`✅ User "${username}" registered with role "${role}".`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Registration failed:', err);
    process.exit(1);
  }
}

// Accept arguments from command line
const [,, username, password, role] = process.argv;

if (!username || !password) {
  console.error('Usage: node registerUser.js <username> <password> [role]');
  process.exit(1);
}

registerUser(username, password, role);
