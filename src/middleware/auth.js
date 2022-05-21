const async = require("hbs/lib/async");
const jwt = require("jsonwebtoken");
const Room = require("../models/model");


const auth = async (req, res, next)=>{
    try {
        const token = req.cookies.jwt
        const verifyuser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyuser);
        next();
        const user = await Room.findOne({_id : verifyuser._id });
        console.log(user)
    } catch (error) {
        console.log(error)
        
    }
}



module.exports = auth;

