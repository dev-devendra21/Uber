import blacklistTokenModel from "../models/blacklistToken.model.js";
import userModel from "../models/user.model.js";
import userService from "../services/user.service.js";
import { validationResult } from 'express-validator';

export const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({ firstname: fullname.firstname, lastname: fullname.lastname, email, password: hashedPassword });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
};

export const loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;

    const user = await userModel.findOne({email}).select('+password');

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();

    user.password = '';

    res.cookie('token', token, { httpOnly: true });

    res.status(200).json({ token, user });
};

export const getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
};


export const logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split("Bearer ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    await blacklistTokenModel.create({ token });

    res.status(200).json({ message: 'Logout successful' });
};