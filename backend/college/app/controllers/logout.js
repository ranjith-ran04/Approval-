function logout(req,res){
    res.clearCookie("token", {
    httpOnly: true,
    secure: false,
  });
  res.status(200).json({ msg: "Logged out successfully" });
}

module.exports = logout;