import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    email: string;
    password: string;
    preference: string;
    is_delete: boolean;
}
interface IUserLogin {
    email: string;
    password: string;
}
const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    preference: { type: Boolean, required: false },
    is_delete: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
export { IUser, IUserLogin };
