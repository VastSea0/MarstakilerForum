import mongoose from "mongoose";

const db = () => {
    mongoose
        .connect("mongodb://localhost:27017/miniForum")
        .then(() => {
            console.log("Veritabanı bağlantısı başarılı"); // bişey olmaz
        })
        .catch((err) => {
            console.error(
                "Veritabanı bağlantısı başarısız oldu. Hata Kodu: ",
                err
            );
        });
};

export default db;
