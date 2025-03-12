import mongoose from 'mongoose';
export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default User;
