import jwt from "jsonwebtoken";

// Kullanıcı kimlik doğrulama middleware'i
export const authenticate = async (req, res, next) => {
    const authHeader =
        req.headers["authorization"] || req.headers["Authorization"];
    console.log("AuthHeader:", authHeader);

    if (
        !authHeader ||
        typeof authHeader !== "string" ||
        !authHeader.toLowerCase().startsWith("bearer ")
    ) {
        console.log("Invalid AuthHeader");
        req.user = null;
        return next();
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
        console.log("Decoded token:", decoded);
        req.user = decoded.user;
        console.log("req.user set to:", req.user);
    } catch (error) {
        console.log("Token verification failed:", error.message);
        req.user = null;
    }

    return next();
};

// Kimlik doğrulaması gerektiren rotalar için middleware
export const requireAuth = (req, res, next) => {
    console.log("requireAuth middleware - req.user:", req.user);
    if (!req.user) {
        return res.status(403).json({
            success: false,
            errors: "Lütfen giriş yapınız",
        });
    }
    return next();
};

// Kimlik doğrulaması yapılmamış olması gereken rotalar için middleware
export const notAuth = (req, res, next) => {
    if (req.user) {
        return res.status(409).json({
            success: false,
            errors: "Zaten giriş yapılmış",
        });
    }

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return next();
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
        if (err) {
            return next();
        }
        return res.status(409).json({
            success: false,
            errors: "Zaten giriş yapılmış",
        });
    });
};

// Refresh token kontrolü için middleware
export const checkRefreshTokenMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            errors: "Mevcut token süresinin bitmesini bekleyin lütfen",
        });
    }

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            errors: "Oturum çerezi bulunamadı",
        });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                errors: "Geçersiz oturum çerezi",
            });
        }
        req.user = decoded.user;
        return next();
    });
};

// Kullanıcı rolü kontrolü için middleware
export const authrole = (...roles) => {
    return (req, res, next) => {
        if (!req.user?.role || !roles.includes(req.user.role)) {
            return res.status(401).json({
                success: false,
                errors: "Yetkisiz erişim",
            });
        }
        return next();
    };
};

// Kullanıcı ID kontrolü için middleware
export const checkUserId = (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return res.status(401).json({
            success: false,
            message: "Yetkisiz erişim",
        });
    }
    return next();
};
