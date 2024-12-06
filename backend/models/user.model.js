import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullname: {
       firstname: {
           type: String,
           required: true,
           minLength: [3, "First name must be at least 3 characters long"],
       },
       lastname: {
           type: String,
           minLength: [3, "Last name must be at least 3 characters long"],
       },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: [3, "Email must be at least 3 characters long"],
    },
    password: {
        type: String,
        required: true,
        select: false, // don't return password
    },
    socketId: {
        type: String,
    },
});

// generate auth token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
    return token;
};

// compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// static method for hash password
userSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const userModel = mongoose.model("user", userSchema);

export default userModel;