import bcrypt from "bcrypt"

export const hashPassword = async (password) => {
   try {
    const saltRound = 10 ;
    //bcrypt hash takes 2 parameters one is pass and second is saltround to make it complex
    const hashedPassword = await bcrypt.hash(password , saltRound);
    return hashedPassword;
   } catch (error) {
    console.log(error);
   } 
}


//compare password 

export const copmarePassword = async (password , hashedPassword) => {
    return bcrypt.compare(password , hashedPassword);
} 