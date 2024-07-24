
import jwt from 'jsonwebtoken';

//middleware to check if the request has token (used in getProfile)
const auth = async (req, res, next) => {
    const token = req.headers.authorization;


    if(!token || !token.startsWith("Bearer")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const authToken = token.split(" ")[1];
       
        const decodedUser = jwt.verify(authToken, process.env.JWT_SECRET);
        req.user = decodedUser;
        next();
    } catch (error) {
        res.status(400).json({ message: "Token is not valid" });
    }
}

export default auth;
