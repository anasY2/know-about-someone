const express=require("express");
const auth=require("../middleware/auth")
const path=require("path");
const User=require("../models/user");
const Profile=require("../models/profile");


// const publicPath=path.join(__dirname,"../../public")

const router=new express.Router();
router.get("/login/",async(req,res)=>{
   res.status(200).render("login",{
       error:req.query.error,
       title:"LogIn"
   })
})
router.get("/signup",async(req,res)=>{
    res.render("signup",{
        error:req.query.error,
        title:"SignUp"
    })
})
router.get("/",(req,res)=>{
    res.sendFile(path.join(publicPath,"index.html"))
})
router.get("/user/createProfile",auth,async(req,res)=>{
res.render("createBio",{
    title:"Bio",
    error:req.query.error
})
})

router.get("/allUsers",auth,async(req,res)=>{
  
     res.render("allUser",{
         users:await Profile.find({}),
         mail:req.user.email
     })              
})
router.post("/login",async(req,res)=>{
  
   try {
       const user=await User.verifyCredentials(req.body.email,req.body.pass)
       
       if(!user){
res.status(400).redirect("/login?error="+"No User")
       }
     const token=  await user.generateToken()
       res.cookie('auth_token',token)
       if(user.new === 1){
        user.new=0;
        await user.save()
           res.redirect("/user/createProfile")
       }else{
           
           res.redirect("/allUsers")
       }
   } catch (error) {
       res.status(400).redirect("/login?error="+error.message)
   }
})
router.post("/signup",async(req,res)=>{
    if(req.body.newPass!==req.body.confirmPass){
        
return res.redirect("/signup?error="+"Passwords dont match")
    }
    try {
        let user=new User({
            email:req.body.newEmail,
            password:req.body.newPass,
           new:1
        })
        await user.save()
       res.redirect("/login")
    } catch (error) {
        res.redirect("/signup?error="+error.message)

    }
})
router.post("/user/createProfile",auth,async (req,res)=>{
    try {
      
        const profile=new Profile({
            name:req.body.username,
            bio:req.body.description,
            avatar:req.body.avatar,
            owner:req.user._id,
            email:req.user.email
        })
        await profile.save()
        res.redirect("/allUsers")
    } catch (error) {
        res.redirect("/user/createProfile?error"+error.message)
    }
})
router.get("/user/logout",auth,async(req,res)=>{
    try {
req.user.tokens=req.user.tokens.filter((token)=>{
    return token.token!==req.token
})
await req.user.save()
res.redirect("/")
    } catch (error) {
        res.send({error:error.message})
    }

})
module.exports=router;