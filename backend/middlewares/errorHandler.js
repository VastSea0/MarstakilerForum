import sendResponse from "../helpers/sendResponse.js";
import mongoose from "mongoose";

const errorHandler = (err, req, res, next) => {
    console.log(err);

    // Mongoose hatalarını özel olarak yönetme
    if (err instanceof mongoose.Error.ValidationError) {
        // Doğrulama hatası
        const validationErrors = Object.values(err.errors).map((error) => ({
            field: error.path,
            message: error.message,
        }));
        return sendResponse(res, 400, "Geçersiz veri veya eksik alanlar", {
            validationErrors,
        });
    } else if (err instanceof mongoose.Error.CastError) {
        // Tip dönüştürme hatası
        return sendResponse(
            res,
            400,
            "Geçersiz veri tipi: Girilen değer beklenen formatta değil",
            null
        );
    } else if (err.code === 11000) {
        // Benzersiz anahtar hatası
        return sendResponse(
            res,
            409,
            "Kayıt zaten mevcut: Bu bilgilerle başka bir kayıt bulunmaktadır",
            null
        );
    } else if (err instanceof mongoose.Error) {
        // Diğer Mongoose hataları
        return sendResponse(
            res,
            500,
            "Veritabanı hatası: Sunucu tarafında beklenmeyen bir hata oluştu",
            null
        );
    }

    // Genel hata yönetimi
    const statusCode = err.statusCode || 500;
    const message = err.message || "Bir Hata Oluştu";
    sendResponse(
        res,
        statusCode,
        message,
        process.env.NODE_ENV === "DEV" ? err : null
    );
};

export default errorHandler;
