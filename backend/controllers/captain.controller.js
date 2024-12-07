import captainModel from "../models/captain.model.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";
import { validationResult } from 'express-validator';
import { createCaptain } from "../services/captain.service.js";


const registerCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const existingCaptain = await captainModel.findOne({ email });

    if (existingCaptain) {
        return res.status(400).json({ message: 'Captain already exists' });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    try {
        const captain = await createCaptain({ firstname: fullname.firstname, lastname: fullname.lastname, email, password: hashedPassword, color: vehicle.color, plate: vehicle.plate, capacity: vehicle.capacity, vehicleType: vehicle.vehicleType });

        const token = captain.generateAuthToken();

        const plainObject = captain.toObject();
        delete plainObject.password;
        
        res.status(201).json({ token, captain });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }

}

const loginCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });    
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await captain.comparePassword(password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token, { httpOnly: true });

    res.status(200).json({ token, captain });
}

const logoutCaptain = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization.split("Bearer ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    await blacklistTokenModel.create({ token });

    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}

const getCaptainProfile = async (req, res) => {
    res.status(200).json(req.captain);
}

export { registerCaptain, loginCaptain, logoutCaptain, getCaptainProfile };