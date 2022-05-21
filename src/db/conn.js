const  mongoose = require ("mongoose")

// creating a database
mongoose.connect("mongodb://localhost:27017/Universit")
.then(()=>{
    console.log("connection is sccessfull")
})
.catch((e)=>{
    console.log(e)
})