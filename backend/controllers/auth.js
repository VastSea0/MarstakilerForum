import User from "../models/user.js";
import Topic from "../models/topic.js";
import Jwt from "jsonwebtoken";
import generateToken from "../helpers/generateToken.js";
import sendResponse from "../helpers/sendResponse.js";
import ApiError from "../helpers/apiError.js";

export const register = async (req, res, next) => {
    try {
        const { firstName, lastName, username, password } = req.body;
        if ((!firstName || !lastName || !username, !password)) {
            throw new ApiError("Lütfen gerekli alanları girin", 400);
        }
        const newUser = await User.create({
            firstName,
            lastName,
            username,
            password,
        });
        sendResponse(res, 200, "Yeni kullanıcı kaydı başarılı", {
            user: newUser,
        });
    } catch (error) {
        return next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        console.log("Username: ", username);
        console.log("Password: ", password);

        if (!username || !password) {
            throw new ApiError("Lütfen kullanıcı adı ve şifrenizi girin", 400);
        }

        const user = await User.findOne({ username: username });
        console.log(user);
        if (!user) {
            throw new ApiError("Kullanıcı bulunamadı", 400);
        }
        const isMatch = await user.verifyPassword(password);

        if (!isMatch) {
            throw new ApiError("Geçersiz bir şifre girdiniz", 400);
        }

        const userData = {
            id: user.id,
            role: user.role,
            username: user.username,
        };

        const accessToken = generateToken(
            userData,
            process.env.ACCESS_SECRET_KEY,
            "1h"
        );
        const refreshToken = generateToken(
            userData,
            process.env.REFRESH_SECRET_KEY,
            "30d"
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // Sadece production'da true
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        sendResponse(res, 200, "Kulanıcı girişi başarılı", {
            token: accessToken,
            user: userData,
        });
    } catch (error) {
        return next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const refreshToken = cookies.refreshToken;

        if (!refreshToken) {
            throw new ApiError("Oturum çerezi bulunamadı", 400);
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "Strict",
            secure: false,
            path: "/", // ! önemliymişşş
        });
        sendResponse(res, 200, "Oturum başarıyla sonlandırıldı");
    } catch (error) {
        return next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const refreshToken = cookies.refreshToken;
        if (!refreshToken) {
            throw new ApiError("Oturum çerezi yok", 400);
        }
        Jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET_KEY,
            (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        throw new ApiError("Oturum çerezi geçersiz", 400);
                    }
                }
                console.log("refresh token decoded user: ", decoded.user);
                const accessToken = generateToken(
                    decoded.user,
                    process.env.ACCESS_SECRET_KEY,
                    "1h"
                );
                console.log(decoded);
                sendResponse(res, 200, "Oturum yenilendi", {
                    token: accessToken,
                    user: decoded.user,
                });
            }
        );
    } catch (error) {
        return next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            const userData = {
                id: user.id,
                username: user.username,
                role: user.role,
            };
            sendResponse(
                res,
                200,
                "Profil bilgileri başarılı bir şekilde alındı",
                { user: userData }
            );
        }
    } catch (error) {
        return next(error);
    }
};

export const getUserProfile = async (req, res, next) => {
    console.log("getUserProfile called - req.user:", req.user);
    console.log("Requested user ID:", req.params.id);
    try {
        const user = await User.findById(req.params.id).lean();

        if (!user) {
            throw new ApiError("Kullanıcı bulunamadı", 404);
        }

        const userProfile = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            role: user.role,
        };

        sendResponse(
            res,
            200,
            "Profile bilgileri başarılı bir şekilde alındı",
            { user: userProfile }
        );
    } catch (error) {
        return next(error);
    }
};

export const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, updateData);
        if (updatedUser) {
            sendResponse(res, 200, "Profil bilgileri güncellendi");
        } else {
            throw new ApiError("Profil bilgileri güncellenemedi", 404);
        }
    } catch (error) {
        return next(error);
    }
};
