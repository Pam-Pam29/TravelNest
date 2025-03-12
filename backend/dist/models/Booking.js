"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BookingSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    package: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Package',
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    travelDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Refunded'],
        default: 'Pending'
    },
    numberOfTravelers: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
});
const Booking = mongoose_1.default.model('Booking', BookingSchema);
exports.default = Booking;
