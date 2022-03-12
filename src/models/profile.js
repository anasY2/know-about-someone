const mongoose=require("mongoose")
const profileSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
       validate(value){
if(value.length < 1){
    throw new Error("Too short")
}
       }
       
    },
    email:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        trim:true,
        required:true,
        validate(value){
            if(value > 100){
                throw new Error("Upto 100 words only")
            }
        }
    },
    avatar:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Types.ObjectId,
        required:true
    }
})
const Profile=mongoose.model("profile",profileSchema)
module.exports=Profile