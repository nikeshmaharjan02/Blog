// Import the User model
const { users } = require("../model")

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const SECRET_KEY = "NODEJS";

const signup = async (req,res) =>{

    const {fullname, email, username, password} = req.body;
    // console.log(req.body)
    // console.log(req.file.filename)
    try{
        
        const existingUser = await users.findOne({ where: { email: email } })
        if(existingUser){
            // return res.status(400).json({message:"User already Exist"})
            req.flash('error','User already exists of this email');
            return res.redirect('/register')
        }
        //password lao hashed gareko
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser =await users.create({
            fullname:fullname,
            email:email,
            username:username,
            password: hashedPassword ,
            profilePicture: process.env.backendUrl + req.file.filename
        });
        req.flash('register','Registered Successfully')

        const token = jwt.sign({email:newUser.email, id : newUser.id}, SECRET_KEY,{
            expiresIn : '1d'
        });

        res.cookie("token",token)
        res.redirect("/login")

    } catch (error) {
        console.log(error);    
        if (!res.headersSent){
            res.status(500).json({message: "Something went Wrong"});
        }
    }
}


const signin = async (req,res) =>{
    const {email, password} = req.body;
    try{
        const existingUser = await users.findOne({ where: { email: email } })
        if(!existingUser){
            // return res.status(404).json({message:"User not found"})
            req.flash('error', 'user not found')
            return res.redirect("/login")
        }

        const matchPassword = await bcrypt.compare(password,existingUser.password);

        if(!matchPassword){
            // return res.status(404).json({message:"Invalid Credentials"});
            req.flash('error','Invalid Email or Password')
            res.redirect('/login')
        }
        const token = jwt.sign({email:existingUser.email, id : existingUser.id}, SECRET_KEY,{
            expiresIn : '1d'
        });
        res.cookie("token",token, { httpOnly: true })
        req.flash('login', 'Login Successful')
        res.redirect("/")

    }catch(error){
        console.log(error);
        // res.status(500).json({message: "Something went Wrong"});
        if (!res.headersSent) {
            res.status(500).json({ message: 'Something went wrong' });
        }
    }
}
const profile = async (req,res) =>{
    const id = req.params.id
    // const foundData = await blogs.findByPk(id)  returns object
    const foundData = await users.findAll({ // 
        where : {
            id : id
        },
        include : {
            model : users
        }
    })
    res.render("profile",{user : foundData})
}

module.exports ={signup, signin,profile}