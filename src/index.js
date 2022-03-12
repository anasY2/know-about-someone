require("./db/mongodb")
const express=require("express")
const app=express();
const path=require("path")
const hbs=require("hbs")
const port=process.env.PORT || 3000;
const userRouter=require("./routers/userRouter")
const cookie=require("cookie-parser")
const publicPath=path.join(__dirname,"../public")
const viewPath=path.join(__dirname,"../views/partials")
app.use(express.static(publicPath))
app.set('view engine','hbs')
hbs.registerPartials(viewPath)
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie())
app.use(userRouter)
app.get("/*",(req,res)=>{
    res.sendFile(path.join(publicPath,"404page.html"))
})
app.listen(port,(req,res)=>{
    console.log(`Server running on port ${port}...`)
})