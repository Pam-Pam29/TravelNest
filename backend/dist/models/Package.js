"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PackageSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    destinations: [{
            type: String,
            trim: true
        }],
    availability: {
        type: Number,
        default: 10
    },
    images: [{
            type: String,
            validate: {
                validator: function (v) {
                    return /^https?:\/\/.+/.test(v);
                },
                message: 'Images must be valid URLs'
            }
        }],
    includedServices: [{
            type: String,
            trim: true
        }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Package = mongoose_1.default.model('Package', PackageSchema);
exports.default = Package;
