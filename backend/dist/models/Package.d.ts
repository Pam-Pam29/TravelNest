import mongoose from 'mongoose';
export interface IPackage extends mongoose.Document {
    title: string;
    description: string;
    price: number;
    duration: number;
    destinations: string[];
    availability: number;
    images: string[];
    includedServices: string[];
}
declare const Package: mongoose.Model<IPackage, {}, {}, {}, mongoose.Document<unknown, {}, IPackage> & IPackage & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default Package;
