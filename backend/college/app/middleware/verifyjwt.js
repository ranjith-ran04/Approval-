const jwt = require('jsonwebtoken')

 const verify = (req, res, next) => {
  const token = req.cookies.token;
  console.log(req.cookies.token);
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token invalid" });
    }
    req.user = decoded;
    console.log("decoded",decoded);
    next();
  });
 }

 module.exports = verify