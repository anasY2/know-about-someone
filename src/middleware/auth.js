const jwt=require("jsonwebtoken")
const User=require("../models/user")
const auth=async(req,res,next)=>{
  try {
    const token=req.cookies['auth_token']
const decode=jwt.verify(token,'knowsecret')
const user=await User.findOne({_id:decode._id,'tokens.token':token})
if(!user){
  return res.redirect("/login")
}
req.token=token;
req.user=user

next()
  } catch (error) {
    return res.redirect("/login")
  }

}
module.exports=auth