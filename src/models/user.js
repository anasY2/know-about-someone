
const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const userSchema=new mongoose.Schema({

    email:{
        type:String,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email")
            }
        },
        required:true
    },
    password:{
        type:String,
        trim:true,
        required:true,
        validate(value){
            if(value.length < 6){
                throw new Error("Too short")
            }else if(value.includes("password")){
                 throw new Error("Password should not contain password")
            }
        }
    },
    new:{
        type:Number
    },
  
    tokens:[
        {
            token:{
                type:String,
                
            }
        }
    ]
})
userSchema.methods.generateToken=async function(){
    const token= jwt.sign({_id:this._id.toString()},'knowsecret',{expiresIn:60*60})
    this.tokens=this.tokens.concat({token})
    await this.save()
    return token
}
userSchema.statics.verifyCredentials=async (email,pass)=>{
    const user=await User.findOne({email:email})
   
    if(!user){
        throw new Error("Invalid Credentials")
    }
    const isValid=await bcrypt.compare(pass,user.password)
    if(!isValid){
        throw new Error("Invalid Credentials!!")
    }
    return user
}
userSchema.pre('save',async function(next){
if(this.isModified("password")){
const hashPassword=await bcrypt.hash(this.password,8);
this.password=hashPassword
}
next()
})
const User=mongoose.model("User",userSchema)

module.exports=User;