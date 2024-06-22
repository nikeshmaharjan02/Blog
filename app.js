const express = require('express');
require("dotenv").config()
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const session = require("express-session")
const flash = require("connect-flash")
const {promisify} = require("util")

const userRouter = require("./routes/userRouter");
const commentRouter = require("./routes/commentRouter");
const blogRouter = require("./routes/blogRouter");

const app = express();

app.use(session({
    secret : "secretencrypter",
    resave : false,
    saveUninitialized : false
}))
app.use(flash())

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Middleware for cookies
app.use(cookieParser());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("./uploads/"))

// View engine setup
app.set('view engine', 'ejs');

app.use(async (req,res,next)=>{
    res.locals.currentUser = req.cookies.token
    if(req.cookies.token){
       const data  =  await promisify(jwt.verify)(req.cookies.token,process.env.SECRET_KEY)
       res.locals.currentUserId = data.id
    }
    next()
})

// Route handlers
app.use("/", userRouter);
app.use("/", blogRouter);
app.use("/", commentRouter);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
