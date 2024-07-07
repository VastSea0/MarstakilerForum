import mongoose from "mongoose";

const db = () => {
    mongoose
        .connect(process.env.DB_URL)
        .then(() => {
            console.log("Veritabanı bağlantısı başarılı");
        })
        .catch((err) => {
            console.error(
                "Veritabanı bağlantısı başarısız oldu. Hata Kodu: ",
                err
            );
        });
};

export default db;
