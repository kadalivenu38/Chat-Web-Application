import jwt from "jsonwebtoken";

export const generateToken = (payLoad) => {
    return jwt.sign(payLoad, process.env.JWT_SECRET, {expiresIn: '1h'});
}