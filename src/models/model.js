const async = require("hbs/lib/async");
const bcrypt = require("bcryptjs");
const  mongoose = require ("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config()

const formate = new mongoose.Schema ({
    fullname : String,
    email : String,
    password : String,
    tokens : [{
        token :{
            type : String
        }
    }]
})

formate.pre("save", async function(next){
    this.password = await bcrypt.hash(this.password, 10);
next()
})

formate.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token})
        console.log(this.tokens)
        await this.save()
        return token
    } catch (error) {
        console.log(error)
    }
}

const Room = new mongoose.model("Classroom", formate);

module.exports = Room;