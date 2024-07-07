import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
        req.user = decoded.userData;
        next();
    } catch (error) {
        console.log("Token verification error: ", error);
        req.user = null;
        next();
    }
};

export const requireAuth = (req, res, next) => {
    if (req.user) {
        return next();
    } else {
        return res.status(403).json({
            success: false,
            errors: "Lütfen giriş yapınız",
        });
    }
};

export const notAuth = (req, res, next) => {
    if (req.user) {
        console.log("41 REQ USER: ", req.user);
        return res.status(409).json({
            success: false,
            errors: "Zaten giriş yapılmış",
        });
    }
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET_KEY,
            (err, decoded) => {
                if (err) {
                    return next();
                } else {
                    console.log("satır 53, decoded user: ", decoded.userData);
                    return res.status(409).json({
                        success: false,
                        errors: "Zaten giriş yapılmış",
                    });
                }
            }
        );
    } else {
        return next();
    }
};

export const checkRefreshTokenMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(403).json({
                success: false,
                errors: "Oturum çerezi bulunamadı",
            });
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET_KEY,
            (err, decoded) => {
                if (err) {
                    return res.status(403).json({
                        success: false,
                        errors: "Geçersiz oturum çerezi",
                    });
                }
                req.user = decoded.userData;
                return next();
            }
        );
    } else {
        // Eğer authHeader varsa, yani access token varsa
        // Sadece uyarı ver ve devam et
        return res.status(403).json({
            success: false,
            errors: "Mevcut token süresinin bitmesini bekleyin lütfen",
        });
    }
};

export const authrole = (...roles) => {
    return (req, res, next) => {
        if (req.user && req.user?.role && roles.includes(req.user.role)) {
            return next();
        } else {
            return res.status(401).json({
                success: false,
                errors: "Yetkisiz erişim",
            });
        }
    };
};

export const checkUserId = (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return res.status(403).json({
            success: false,
            message: "Yetkisiz erişim",
        });
    }
    return next();
};
