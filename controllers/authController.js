import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

//register a user
export const register = async (req, res) => {
    
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 11);  //hash the password using bcrypt

    try {
        //check if user already registered
        const userAlreadyExists = await User.findOne({where:{
            email:email
        }})

        if(userAlreadyExists){
            return res.status(400).json({
                message:"User already exists"
            })
        }
        //create new user, if user is not registered
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

       //return data
        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            msg:"registered successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
    
}


//login a user
export const login = async (req, res) => {
    const { email, password } = req.body;
    //check if all values are provided
    if(!email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }

    try {

        //check if user exists
        const user = await User.findOne({ where: { email } });

        if(!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        //check if password is correct
        const isPasswordCrct = await bcrypt.compare(password, user.password);

        if(!isPasswordCrct) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        //generate token
        const token = jwt.sign({ userId: user.id, name: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            token: token,
            msg:"logged in successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const getProfile = async (req, res) => {
    //if there is no user field in request throw error, it is injected by auth middleware after checking if token is present
    if(!req.user){
        return res.status(401).json({message:"No token, authorization denied"})
    }

    //destructure userId from req.user
    const {userId} = req.user;

    try {


        //find the user 
        const user = await User.findOne({ where: { id: userId } });

        //if user does not exist in DB, throw error
        if(!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        //send data
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            msg:"profile fetched successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

