const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const login = async (req, res) => {
  const { counsellingCode, password } = req.body;

  const query = "SELECT * FROM admin_login WHERE name = ?";
  try {
    const result = await db.query(query, [counsellingCode]);
    const user = result[0][0];
    // console.log('change',user);

    if (!user || !user.pass) {
      // console.log(user);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // const isMatch = bcrypt.compareSync(password, user.pass);
    // console.log(password);
    if (password !== user.pass) {
    //   console.log(isMatch);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({msg : 'user Found'});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

function fetchlogin(req,res){
  const name = req.user?.name || false;
  // console.log(req.user);
  if(!name) return res.status(401).json({msg:'user not found'});
  return res.status(200).json({msg:'user found'});
}

module.exports = {fetchlogin,login};
 