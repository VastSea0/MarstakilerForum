import Topic from "../models/topic.js";
import mongoose from "mongoose";

const likeTopic = async (userId, topicId) => {
    try {
        const objectTopicId = new mongoose.Types.ObjectId(topicId);
        if (!mongoose.Types.ObjectId.isValid(objectTopicId)) {
            console.log("Geçersiz Topic Id");
            throw new Error("Geçersiz topic ID");
        }
        const topic = await Topic.findById(topicId);
        console.log(topic);
        if (!topic) {
            console.log("Böyle bir konu yok");
            throw new Error("Böyle bir konu yok");
        }
        if (!topic.likes.includes(userId)) {
            topic.likes.push(userId);

            const dislikeIndex = topic.dislikes.indexOf(userId);
            if (dislikeIndex !== -1) {
                topic.dislikes.splice(dislikeIndex, 1);
            }
            await topic.save();
            return topic;
        }
    } catch (error) {
        console.log("Bir hata oluştu: ", error);
        throw error;
    }
};

export default likeTopic;
