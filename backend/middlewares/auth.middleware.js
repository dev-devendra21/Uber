import userModel from "../models/user.model.js";
import captainModel from "../models/captain.model.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const  token = req.cookies.token || req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const isBlackListed = await blacklistTokenModel.findOne({ token });

    if (isBlackListed) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decodedToken._id);

        req.user = user;

        return next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }

}

const captainAuthMiddleware = async (req, res, next) => {
    const  token = req.cookies.token || req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const isBlackListed = await blacklistTokenModel.findOne({ token });

    if (isBlackListed) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const captain = await captainModel.findById(decodedToken._id);

        req.captain = captain;

        return next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export {authMiddleware, captainAuthMiddleware};
    