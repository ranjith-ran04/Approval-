function home(req,res){
    const name = req.user.name;
    if(!name) return res.status(401).json({msg:'user not found'});
    return res.status(200).json({msg:'user found'});
}

module.exports = home;