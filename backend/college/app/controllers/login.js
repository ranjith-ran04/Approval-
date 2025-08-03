const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();
const bcrypt = require("bcrypt");

const login = async(req, res) => {
  const { counsellingCode, password } = req.body;

  const query = "SELECT * FROM user_login WHERE c_code = ?";
  try{
  const [result] = await db.query(query, [counsellingCode, password])

    const user = result[0];
    const isMatch = bcrypt.compareSync(password, user.pass);
    if (!isMatch && user.pass !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { counsellingCode: user.c_code },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 10 * 60 * 1000,
    });

    return res.status(200).json({ changed: user.changed });
  }catch(err){
    console.log(err);
  }
};

module.exports = login;
