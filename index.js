import express from "express";
import path from "path";
import mongoose from "mongoose";
import { error } from "console";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose
  .connect("mongodb://localhost:27017", {
    dbName: "backend",
  })
  .then(() => console.log("Database connected"))
  .catch((error) => {
    console.log(error);
  });

//Creating  schema(What data should store in our database)
// const messageSchema = new mongoose.Schema({
//   name: String,
//   email: String
// })

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

//Creating model or collection
// const Messge = mongoose.model("Message",messageSchema)

const User = mongoose.model("User", userSchema);

const app = express();

// const users = [];

//middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const decoded = jwt.verify(token, "3ertgfghbg");
    // console.log(decoded);

    req.user = await User.findById(decoded._id);
    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/", isAuthenticated, (req, res) => {
  //  const pathLocation = path.resolve()
  // res.sendFile(path.join(pathLocation,"./index.html"))
  // res.render("index", { name: "Rajesh" });
  // console.log(req.cookies.token);
  // const {token} = req.cookies
  // res.render("login");
  // if(token) {
  //   res.render("logout")
  // } else {
  // console.log(req.user);
  res.render("logout", { name: req.user.name });
  // }
  // res.sendFile("index.html")
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) return res.redirect("/register");

  // const isMatch = user.password === password;
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.render("login", { email, message: "Incorect message" });

  const token = jwt.sign({ _id: user._id }, "3ertgfghbg");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

// app.post("/login",async(req,res) =>{
//   // console.log(req.body);
//   const {name,email} = req.body

//   let user  = await User.findOne({email})
// if(!user) {
//  return res.redirect("/register");
// }

//     user = await User.create({name,email})

//    //token creation using jwt
//    const token = jwt.sign({_id:user._id},"3ertgfghbg")
//   //  console.log(token);

//   res.cookie("token",token,{
//     httpOnly:true,
//     expires:new Date(Date.now() + 60*1000)
//   })
//   res.redirect("/")
// })

app.post("/register", async (req, res) => {
  // console.log(req.body);
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({ name, email, password: hashedPassword });

  //token creation using jwt
  const token = jwt.sign({ _id: user._id }, "3ertgfghbg");
  //  console.log(token);

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

// app.get("/add", async(req, res) => {
//  await Messge.create({name:"Raj",email:"raj@gmail.com"})
//     res.send("Nice");
// });

// app.get("/success", (req, res) => {
//   res.render("success");
// });

// app.post("/contact", (req, res) => {
//   users.push({ userName: req.body.name, userEmail: req.body.email });
//   // res.render("success")
//   res.redirect("/success");
// });

// app.post("/contact", async(req, res) => {
// //  const messageData = { name: req.body.name, email: req.body.email };
// //  await Messge.create({ name: req.body.name, email: req.body.email })
// const {name,email} = req.body
// // await Messge.create({name:name,email:email})
// await Messge.create({name,email})
//   res.redirect("/success");
// });

// app.get("/users", (req, res) => {
//   res.json({ users });
// });

app.listen(8000, () => {
  console.log("Server is working");
});
