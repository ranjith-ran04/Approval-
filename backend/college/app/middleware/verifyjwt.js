const jwt = require('jsonwebtoken')

 const verify = (req, res, next) => {
  const token = req.cookies.token;
<<<<<<< HEAD
=======
  console.log(token);
>>>>>>> 51d74f161c2401dbe4c9f719c371648fd551158b
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token invalid" });
    }
    req.user = decoded;
    console.log(req.user);
    next();
  });
 }

 module.exports = verify