const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token invalid" ,err:err.message});
    }
    req.user = decoded;
    // // console.log(req.user);
    next();
  });
};

module.exports = verify;
