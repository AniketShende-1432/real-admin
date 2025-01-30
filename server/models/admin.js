const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
    name: {
        type :String,
        required : true,
    },
    email: {
        type :String,
        required : true,
        unique:true,
    },
    password: {
        type :String,
        required : true,
    },
    phone: {
        type: Number,
        required: true,
    },
    role: {
        type :String,
        required:true,
    },
    status: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active',
    },
    // sell: [
    //     { type: mongoose.Types.ObjectId, ref: 'Sell' },
    // ],
    // rent: [
    //     { type: mongoose.Types.ObjectId, ref: 'Rent' },
    // ],
    // plot: [
    //     { type: mongoose.Types.ObjectId, ref: 'Plot' },
    // ],
    // pg: [
    //     { type: mongoose.Types.ObjectId, ref: 'PG' },
    // ],
    // commercial: [
    //     { type: mongoose.Types.ObjectId, ref: 'Commercial' },
    // ],
},{ timestamps: true });

module.exports = mongoose.model("Admin",adminSchema);