const express=require('express');
const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const User=require('../models/User');  //User Schema
const Blog=require('../models/Blog');  //Blog Schema
const {verifyUser}=require('../middleware/authmiddleware');

const app=express();

app.use(cors({
    origin:"http://localhost:5000",
    credentials:true
}));

app.use(express.json());

app.use(cookieParser());

const KEY="jwt_token";  //Any name ae our wish

mongoose.connect('mongodb://localhost:27017/Blog-website').then(()=>{console.log('Mongo DB connected')}).catch((e)=>console.log(e));

app.post("/signup", async(req,res)=>{
    const {name,email,password,role} = req.body;
    const user=await User.findOne({email});
    if(user) return res.status(400).json({message:"User Exist"});
    const pass=await bcrypt.hash(password,10);
    await User.create({name,email,password:pass,role});
    res.status(200).json({message:"User Registered"});
});

app.post("/login", async(req,res)=>{
    //console.log('body:', req.body);
    const  {email,password } = req.body;
    const user=await User.findOne({email});
    if(!user) return res.status(400).json({message:"User Not Found"});
    const pass=await bcrypt.compare(password,user.password);
    if(!pass) return res.status(400).json({message:"Password Incorrect"});

    const token=jwt.sign({id : user._id}, KEY , {expiresIn:'1h'});
    
    res.cookie("token",token,{
        httpOnly:true,
        maxAge:3600000,
        sameSite: "lax"
    });

    res.json({token});
});

app.get("/login-check",verifyUser, async(req,res)=>{
    return res.status(200).json({message:"Logged"});
});

app.get("/verify",verifyUser,async(req,res)=>{
        const decode=req.decode;
        const user=await User.findById(decode.id);
        if(user)
        res.json({id:user.id,user:user});
});

app.get("/logout",async(req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});

app.post("/add-blog",verifyUser,async(req,res)=>{
    const {title,content}=req.body;
    const decode=req.decode;
    const user=await User.findById(decode.id);
    const logId=user.id;
    const name=user.name;
    await Blog.create({logId,name,content,title});
    res.json({message:"Added"});
});

app.delete("/delete-blog",verifyUser,async(req,res)=>{
    const id=req.body.id;
    const deleted=await Blog.findByIdAndDelete(id);
    if(deleted) return res.status(200).json({message:"Deleted"});
    return res.status(400).json({message:"Not deleted"});
});

app.get("/view-blogs",async(req,res)=>{
    const blogs=await Blog.find();
    if(blogs) return res.status(200).json({blogs});
    return res.status(400).json({message:"No blogs found."})
});

app.patch("/edit-blog",verifyUser,async(req,res)=>{
    const {blogId,editContent,editTitle}=req.body;
    const edit = await Blog.findByIdAndUpdate(
    blogId,
    {
      title :editTitle,
      content : editContent
    },
    {new : true}
    );
    if(edit)
    res.json({message:"Edited"});
});

app.patch("/like",verifyUser,async(req,res)=>{
    const id=req.body.id;
    const decode=req.decode;
    const use=await User.findById(decode.id);
    const logId=use.id;
    const blog = await Blog.findById(id);
    const check = blog.likes.includes(logId);
    const user = await Blog.findByIdAndUpdate(
        id,
        check
        ? {$pull : {likes : logId}}
        : {$addToSet : {likes : logId}},
        {new : true}
    );
    if(!user) res.status(400).json({msg:"Not"});
    return res.json({count: user.likes.length});
});

app.get("/check",async(req,res)=>{
    const token=req.cookies.token;
    if(token) return res.status(200).json({message:"log"});
    else return res.status(200).json({message:"nolog"});
});

app.get("/view/:id",async(req,res)=>{
    const id=req.params.id;
    const content=await Blog.findById(id);
    if(content) return res.status(200).json({blog:content});
    return res.status(400).json({blog:"Not Found"});
});

app.patch("/comments",verifyUser,async(req,res)=>{
    const {id,comment}=req.body;
    const decode=req.decode;
    const use=await User.findById(decode.id);
    const userId=use.id;
    const userName=use.name;
    const user = await Blog.findByIdAndUpdate(
        id,
        {$push : {comments : {id,userId,userName,comment}}},
        {new : true}
    );
    if(!user) res.status(400).json({msg:"Not"});
    return res.json({count: user.likes.length});
});

app.delete("/delete-comment",verifyUser,async(req,res)=>{
    const {id,blogId}=req.body;
    const deleted = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: {
          comments: {_id: id}
        }
      },
      { new: true }
    );
    if(deleted) return res.status(200).json({message:"Deleted"});
    return res.status(400).json({message:"Not deleted"});
});

app.patch("/save", verifyUser, async (req, res) => {
  try {
    const blogId = req.body.id;
    const decode=req.decode;
    const use=await User.findById(decode.id);
    const logId = use._id;
    let save = await User.findById(logId);
    const alreadySaved = save.blogs.includes(blogId);
    const updated = await User.findByIdAndUpdate(
      logId,
      alreadySaved
        ? { $pull: { blogs: blogId } }
        : { $addToSet: { blogs: blogId } },
      { new: true }
    );
    res.json({saved: !alreadySaved,count: updated.blogs.length});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/view-saved/:id",async(req,res)=>{
    const id=req.params.id;
    const logId=await User.findById(id);
    return res.status(200).json({blog:logId.blogs});
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server connected to port : ${PORT}`);
});
