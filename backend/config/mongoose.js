import mongoose from "mongoose";

const db = () => {
    mongoose
        .connect(
            process.env.NODE_ENV === "prod"
                ? process.env.PROD_DB_URL
                : process.env.DEV_DB_URL
        )
        .then(() => {})
        .catch((err) => {
            console.error(
                "Veritabanı bağlantısı başarısız oldu. Hata Kodu: ",
                err
            );
        });
};

export default db;
