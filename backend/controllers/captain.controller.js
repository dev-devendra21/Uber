import captainModel from "../models/captain.model.js";
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

export { registerCaptain }