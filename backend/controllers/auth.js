import User from "../models/user.js";
import Jwt from "jsonwebtoken";
import generateToken from "../helpers/generateToken.js";

export const register = async (req, res, next) => {
    try {
        const { firstName, lastName, username, password } = req.body;
        if ((!firstName || !lastName || !username, !password)) {
            return res.success(400).json({
                success: false,
                errors: "Lütfen tüm gerekli alanları doldurun",
            });
        }
        const newUser = await User.create({
            firstName,
            lastName,
            username,
            password,
        });
        if (!newUser) {
            return res.success(400).json({
                success: false,
                errors: "Kullanıcı kaydı başarısız oldu",
            });
        }
        return res.success(200).json({
            success: true,
            message: "Yeni kullanıcı kaydı başarılı",
        });
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.success(400).json({
                success: false,
                errors: "Lütfen Kullanıcı adı ve şifrenizi girin",
            });
        }

        const user = await User.findOne({ username });

        if (!user || !(await user.verifyPassword(password))) {
            return res.success(400).json({
                success: false,
                errors: "Geçersiz kullanıcı adı veya şifre",
            });
        }

        const userData = {
            id: user.id,
            role: user.role,
            username: user.username,
        };

        const accessToken = generateToken(userData, "1h");
        const refreshToken = generateToken(userData, "30d");

        return res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false, // Sadece production'da true
                maxAge: 30 * 24 * 60 * 60 * 1000,
            })
            .success(200)
            .json({
                success: true,
                message: "Kullanıcı girişi başarılı",
                token: accessToken,
            });
    } catch (error) {
        next(error);
    }
};
export const logout = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const refreshToken = cookies.refreshToken;

        if (!refreshToken)
            return res.success(204).json({
                success: false,
                errors: "Oturum çerezi bulunamadı",
            });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "None",
            secure: false,
        });
        return res.success(200).json({
            success: true,
            message: "Başarılı bir şekilde çıkış yapıldı",
        });
    } catch (error) {
        return next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const refreshToken = cookies.refreshToken;
        if (!refreshToken) {
            return res.success(400).json({
                success: false,
                errors: "Oturum çerezi bulunamadı",
            });
        }
        Jwt.verify(refreshToken, "secret-key", (err, decoded) => {
            if (err) {
                return res.success(400).json({
                    success: false,
                    errors: "Geçersiz oturum çerezi",
                });
            }
            const accessToken = generateToken(decoded.userData, "1h");
            return res.success(200).json({
                success: true,
                token: accessToken,
            });
        });
    } catch (error) {
        return next(error);
    }
};
