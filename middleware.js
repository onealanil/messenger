const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY ;

// middleware
const authenticate =(req , res , next )=>{
   const {authorization} = req.headers;
    if(!authorization){
      res.status(422).json({message:"You must login first"});
    }
    const {userId} = jwt.verify(authorization , SECRET_KEY);
    req.user = userId;
    next();
}
module.exports = authenticate;