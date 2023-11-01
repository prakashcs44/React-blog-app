const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer")
const fs = require('fs');
const uploadMiddleware = multer({dest:'uploads/'})
const salt = bcrypt.genSaltSync(10);
const secretKey = "dfjibnjdc";
const Post = require("./models/Post.js")
const path = require("path");




app.use(cors({credentials:true,origin:"http://localhost:3000"}));
app.use(express.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'uploads')))


mongoose.connect("mongodb://127.0.0.1:27017/blog-app")
.then(()=>console.log("DB connected"))
.catch((err)=>console.log(err));


app.post("/register",async (req,res)=>{
    const {username,password} = req.body;
    const hashedPassword =  bcrypt.hashSync(password,salt);
    try{
        const newUser = await User.create({
            username,
            password:hashedPassword
        });
        res.json(newUser);
    }
    catch(err){
        res.status(400).json({message:err.message});
    } 
})

app.post("/login",async(req,res)=>{
    const {username,password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        return res.json({message:"Invalid Username"})
    }
    const passOk = bcrypt.compareSync(password,user.password);
    if(passOk){

      jwt.sign({username,id:user._id},secretKey,{},(err,token)=>{
        if(err) throw err;
       res.cookie('token',token).json({
        id:user._id,
        username
       });
      });
    }
    else res.status(400).json({message:"Incorrect password"})
})
app.get("/profile",(req,res)=>{
    const {token}  = req.cookies;
    jwt.verify(token,secretKey,{},(err,info)=>{
     if(err) throw err;
     res.json(info);
    })
    res.json(req.cookies);
})
app.post("/logout",(req,res)=>{
    res.cookie("token","").json("ok");
})
app.post("/post",uploadMiddleware.single('file'),async(req,res)=>{
   const {originalname,path} = req.file;
   const parts = originalname.split('.');
   const ext =parts[parts.length-1];
   const newPath = path+'.'+ext;
   fs.renameSync(path,newPath);
   const {token}  = req.cookies;
   jwt.verify(token,secretKey,{},async (err,info)=>{
    if(err) throw err;
    const {title,summary,content} = req.body;
    const post = await Post.create({
     title,
     summary,
     content,
     cover:newPath,
     author:info.id
   })
   res.json(post);
   })
 
})

app.get('/post',async (req,res)=>{
  const posts = await  Post.find().populate('author',['username']).sort({createdAt:-1}).limit(20);
  res.json(posts);
});

app.get("/post/:id",async (req,res)=>{
    const {id} = req.params;
    const post = await Post.findById(id).populate('author',['username']);
    res.json(post);
})


app.put('/post',uploadMiddleware.single('file'),async (req,res)=>{
  let newPath = null;
  if(req.file){
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext =parts[parts.length-1];
     newPath = path+'.'+ext;
    fs.renameSync(path,newPath);
  }
  const {token}  = req.cookies;
  jwt.verify(token,secretKey,{},async (err,info)=>{
   if(err) throw err;
   const {id,title,summary,content} = req.body;
    const post  = await Post.findById(id);
    const isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id);
    if(!isAuthor){
       return res.status(400).json("you are not the author");
    }
    
    await Post.updateOne({_id:post._id},{
    title,
    summary,
    content,
    cover:newPath ? newPath : post.cover,
    author:info.id
  })
  res.json(post);
  })
})









app.listen(3001,()=>{
    console.log("Server started");
});

