const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/strangersdb",{
    useNewUrlParser:true
})