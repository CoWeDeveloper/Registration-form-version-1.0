const express = require("express");
const { appendFileSync } = require("fs");
const path = require("path")
const hbs = require("hbs");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
require("./db/conn");
auth = require("./middleware/auth.js")
const Room = require("./models/model");
const async = require("hbs/lib/async");
const cookiePareser = require("cookie-parser")
const port = process.env.PORT || 3000
const app = express();

// // joining path
const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "/template/views")
const partial_path = path.join(__dirname, "/template/partials")


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookiePareser());
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);


//middleware
app.use("/css", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")))
app.use("/js", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")))
app.use("/jq", express.static(path.join(__dirname, "../node_modules/jquery/dist/jq")))


app.get("/", (req,res)=>{
    res.render("index")
})
app.get("/login", (req,res)=>{
    res.render("login")
})

app.get("/secret", auth, (req, res)=>{
    console.log(req.cookies.jwt);
    res.render("secret")
})

app.post("/register", async (req,res)=>{
    try{
    password = req.body.password
    cpassword = req.body.confirmpassword

    console.log(password)

    if(password ===cpassword){
      const register = new Room({
        fullname : req.body.fullname,
        email : req.body.email,
        password : password

    });

    const token = await register.generateAuthToken();
    res.cookie("jwt", token, {
        expires : new Date(Date.now() + 30000),
        httpOnly: true
    })
    const registered = await register.save();

    console.log(registered)
    res.status(201).render("index")
    }
}catch(e){
    console.log("The error is", e)
}
})

app.post("/login", async(req,res)=>{
    try{
  const email = req.body.email
  const password = req.body.password

  const useremail = await Room.findOne({email})
  const match = bcrypt.compare(password, useremail.password);
  const token = await useremail.generateAuthToken();
  console.log(token)
  res.cookie("jwt", token, {
      expires : new Date(Date.now() + 30000),
      httpOnly: true
    })
    
    
    const fullname = {"Name" : useremail.fullname};
    console.log (fullname)
    
    

    
  if(match){
      res.render("newpage", fullname)
  }else{
      res.send("invalid, kindly please register")
  }
}catch(e){
    console.log(e)
}

    
})

app.listen(port)