import Topic from "../models/topic.js";
import mongoose from "mongoose";

const dislikeTopic = async (userId, topicId) => {
    try {
        const objectTopicId = new mongoose.Types.ObjectId(topicId);
        if (!mongoose.Types.ObjectId.isValid(objectTopicId)) {
            console.log("Geçersiz Topic Id");
            throw new Error("Geçersiz topic ID");
        }
        const topic = await Topic.findById(objectTopicId);
        if (!topic) {
            console.log("Böyle bir konu yok");
            throw new Error("Böyle bir konu yok");
        }
        if (!topic.dislikes.includes(userId)) {
            topic.dislikes.push(userId);

            const likeIndex = topic.likes.indexOf(userId);
            if (likeIndex !== -1) {
                topic.likes.splice(likeIndex, 1);
            }

            await topic.save();
            return topic;
        }
    } catch (error) {
        console.log("Bir hata oluştu: ", error);
        throw error;
    }
};

export default dislikeTopic;
