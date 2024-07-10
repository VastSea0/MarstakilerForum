import Topic from "../models/topic.js";
import mongoose from "mongoose";

const dislikeTopic = async (userId, topicId) => {
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

        if (dislikeIndex !== -1) {
            // Kullanıcı zaten dislike atmış, dislike'ı kaldır
            topic.dislikes.splice(dislikeIndex, 1);
            console.log("Dislike kaldırıldı");
        } else {
            // Kullanıcı dislike atmamış, dislike ekle
            topic.dislikes.push(userId);
            console.log("Dislike eklendi");

            // Eğer like varsa, onu kaldır
            if (likeIndex !== -1) {
                topic.likes.splice(likeIndex, 1);
                console.log("Var olan like kaldırıldı");
            }
        }

        console.log("Güncellenmiş topic:", topic);
        await topic.save();
        return topic;
    } catch (error) {
        console.error("dislikeTopic fonksiyonunda hata:", error);
        throw error;
    }
};

export default dislikeTopic;
