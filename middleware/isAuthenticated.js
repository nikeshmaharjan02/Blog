
const jwt = require("jsonwebtoken")
const {promisify} = require("util")
const { users } = require("../model")

const SECRET_KEY = "NODEJS";

exports.isAuthenticated = async (req,res,next)=>{
  const token =   req.cookies.token

  if(!token || token === null || token === undefined){
    return res.redirect("/login")
  }
  // yeti token aayo vaney 
  const verifiedResult = await promisify(jwt.verify)(token,SECRET_KEY)
  const user = await users.findByPk(verifiedResult.id)
  if(!user){
    return res.redirect("/login")
  } 
  req.userId = verifiedResult.id
  next()
}