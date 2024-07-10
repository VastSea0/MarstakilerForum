import Topic from "../models/topic.js";
import mongoose from "mongoose";

const likeTopic = async (userId, topicId) => {
    try {
        const objectTopicId = new mongoose.Types.ObjectId(topicId);
        if (!mongoose.Types.ObjectId.isValid(objectTopicId)) {
            throw new Error("Geçersiz topic ID");
        }
        const topic = await Topic.findById(topicId);

        if (!topic) {
            throw new Error("Böyle bir konu yok");
        }

        console.log("Mevcut topic durumu:", topic);
        console.log("İşlem yapan kullanıcı ID:", userId);

        const likeIndex = topic.likes.indexOf(userId);
        const dislikeIndex = topic.dislikes.indexOf(userId);

        if (likeIndex !== -1) {
            // Kullanıcı zaten like atmış, like'ı kaldır
            topic.likes.splice(likeIndex, 1);
            console.log("Like kaldırıldı");
        } else {
            // Kullanıcı like atmamış, like ekle
            topic.likes.push(userId);
            console.log("Like eklendi");

            // Eğer dislike varsa, onu kaldır
            if (dislikeIndex !== -1) {
                topic.dislikes.splice(dislikeIndex, 1);
                console.log("Var olan dislike kaldırıldı");
            }
        }

        console.log("Güncellenmiş topic:", topic);
        await topic.save();
        return topic;
    } catch (error) {
        console.error("likeTopic fonksiyonunda hata:", error);
        throw error;
    }
};

export default likeTopic;
