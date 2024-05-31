import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const jwt_token: string = process.env.JWT_SECRET ?? ""

export const generateToken = (payload: any) => {
    return jwt.sign(payload, jwt_token)
}
export const verifyToken = (token: string) => {
    return jwt.verify(token, jwt_token)
}

export const hashPassword = async (password: string) => {
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const matchPassword = async (enterPassword: string, hashPassword: string) => {
    return await bcrypt.compare(enterPassword, hashPassword);

}