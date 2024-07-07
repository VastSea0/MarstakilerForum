import User from "../models/user.js";
import Topic from "../models/topic.js";
import Jwt from "jsonwebtoken";
import generateToken from "../helpers/generateToken.js";

export const register = async (req, res, next) => {
    try {
        const { firstName, lastName, username, password } = req.body;
        if ((!firstName || !lastName || !username, !password)) {
            return res.status(400).json({
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
            return res.status(400).json({
                success: false,
                errors: "Kullanıcı kaydı başarısız oldu",
            });
        }
        return res.status(200).json({
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
            return res.status(400).json({
                success: false,
                errors: "Lütfen Kullanıcı adı ve şifrenizi girin",
            });
        }

        const user = await User.findOne({ username });

        if (!user || !(await user.verifyPassword(password))) {
            return res.status(400).json({
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
            .status(200)
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
            return res.status(204).json({
                success: false,
                errors: "Oturum çerezi bulunamadı",
            });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "Strict",
            secure: false,
            path: "/", // ! önemliymişşş
        });
        return res.status(200).json({
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
            return res.status(400).json({
                success: false,
                errors: "Oturum çerezi bulunamadı",
            });
        }
        Jwt.verify(refreshToken, "secret-key", (err, decoded) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    errors: "Geçersiz oturum çerezi",
                });
            }
            const accessToken = generateToken(decoded.userData, "1h");
            return res.status(200).json({
                success: true,
                token: accessToken,
                data: decoded.userData,
            });
        });
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

            return res.status(200).json({
                success: true,
                message: "Profil bilgileri başarılı bir şekilde alındı",
                data: userData,
            });
        }
    } catch (error) {
        return next(error);
    }
};

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı",
            });
        }

        const topics = await Topic.find({ author: user._id }).lean();
        console.log("\n\n\nUser Profile Topics: ", topics);
        const filteredTopics = topics.map((topic) => {
            return {
                _id: topic._id,
                title: topic.title,
                content: topic.content,
                author: topic.author,
                authorName: user.username,
                commentCount: topic.comments.length,
                likeCount: topic.likes.length,
                dislikeCount: topic.dislikes.length,
                createdAt: topic.createdAt,
            };
        });

        const userProfile = {
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role,
            },
            topics: filteredTopics,
        };

        console.log("User Profile Topics: ", userProfile.topics);
        return res.status(200).json({
            success: true,
            message:
                "Profil bilgileri ve gönderiler başarılı bir şekilde alındı",
            data: userProfile,
        });
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
            return res.status(200).json({
                success: true,
                message: "Profil başarılı bir şekilde güncellendi",
            });
        } else {
            return res.status(400).json({
                success: false,
                errors: "Profil güncellenemedi",
            });
        }
    } catch (error) {
        return next(error);
    }
};
