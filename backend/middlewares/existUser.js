import User from "../models/user.js";
const existUser = async (req, res, next) => {
    try {
        const username = req.body.username;
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({
                success: false,
                errors: "Bu kullanıcı adı zaten kayıtlı",
            });
        }
        return next();
    } catch (error) {
        return next(error);
    }
};

export default existUser;
