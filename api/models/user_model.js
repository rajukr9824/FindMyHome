const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://www.pngkey.com/png/full/115-1150152_default-profile-picture-avatar-png-green.png",
    },
   

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
