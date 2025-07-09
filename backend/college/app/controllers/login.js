const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const login = (req, res) => {
  const { counsellingCode, password } = req.body;

  const query = 'SELECT * FROM user_login WHERE c_code = ? AND pass = ?';
  db.query(query, [counsellingCode, password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result[0];

    const token = jwt.sign(
      {counsellingCode: user.c_code },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 10*60*1000
    });

    return res.status(200).json({ changed: user.changed }); 
  });
}

module.exports = login
