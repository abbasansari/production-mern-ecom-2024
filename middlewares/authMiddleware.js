import  JWT  from "jsonwebtoken";
import userModel from "../models/userModel.js";

//Protected Route Token Based 
export const requireSigin = async (req , res , next) => {
    try {
        //JWT.verify take 2 arguments 1 token which is in req.header.authorization and 2 secret key
    const decode = JWT.verify(req.headers.authorization , process.env.JWT_SECRET);
    //to solve undeifined id error in isAdmin middleware
    req.user = decode;   
    next();
    
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Not a vlid user"
            }
        );
    }

}


//Admin access middleware

export const isAdmin = async(req, res , next)=> {
    try {
        //req.user._id is getting at the time of loginn we are passing in res
    const user = await userModel.findById(req.user._id)
    if (user.role !== 1) {
        return res.status(401).send({
            success:false , 
            message: "unAuthorized User"
        });
    }else{
        next();
    }
        
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success:false ,
            error, 
            message: "Error in admin MiddleWare"
        })    
    }   
}