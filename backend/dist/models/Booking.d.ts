import mongoose from 'mongoose';
export interface IBooking extends mongoose.Document {
    user: mongoose.Types.ObjectId;
    package: mongoose.Types.ObjectId;
    bookingDate: Date;
    travelDate: Date;
    totalPrice: number;
    status: 'Pending' | 'Confirmed' | 'Cancelled';
    paymentStatus: 'Pending' | 'Paid' | 'Refunded';
    numberOfTravelers: number;
}
declare const Booking: mongoose.Model<IBooking, {}, {}, {}, mongoose.Document<unknown, {}, IBooking> & IBooking & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default Booking;
