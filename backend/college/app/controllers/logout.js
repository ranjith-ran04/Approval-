function logout(req, res) {
  const token = req.cookies.token;
  // // console.log(token)
  if (!token) return res.status(200).json({ msg: "token not found" });
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
  });
  res.status(200).json({ msg: "Logged out successfully" });
}

module.exports = logout;
