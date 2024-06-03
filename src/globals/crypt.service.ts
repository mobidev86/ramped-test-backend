import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const jwt_token: string = process.env.JWT_SECRET ?? ""

export const generateToken = (payload: any) => {
    return jwt.sign(payload, jwt_token)
}
//#region  verify json token
export const verifyToken = (token: string) => {
    return jwt.verify(token, jwt_token)
}
//#endregion


//#region hashed password
export const hashPassword = async (password: string) => {
    const password_hash: number = (+(process.env.HASH_PASSWORD_ROUND ?? 10)) as number
    // Encrypt password
    const salt = await bcrypt.genSalt(password_hash);
    return await bcrypt.hash(password, salt);
}
//#endregion

//#region verify password
export const matchPassword = async (enterPassword: string, hashPassword: string) => {
    return await bcrypt.compare(enterPassword, hashPassword);

}
//#endregion