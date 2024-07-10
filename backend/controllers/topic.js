import Topic from "../models/topic.js";
import Comment from "../models/comment.js";
import likeTopic from "../helpers/likeTopic.js";
import dislikeTopic from "../helpers/dislikeTopic.js";
import mongoose from "mongoose";
import sendResponse from "../helpers/sendResponse.js";
import ApiError from "../helpers/apiError.js";

export const getAllTopic = async (req, res, next) => {
    try {
        let sortBy = req.query.sortBy || "createdAt"; // Default sorting field
        let sortDirection = req.query.sortDirection || "desc"; // Default sorting direction

        // Listeleyebileceğimiz alanları tanımlayalım
        const validSortFields = [
            "createdAt",
            "likeCount",
            "dislikeCount",
            "commentCount",
        ];

        // Eğer sortBy parametresi geçerli bir alan ise ve sortDirection 'asc' veya 'desc' ise sıralama işlemini gerçekleştirelim
        if (
            validSortFields.includes(sortBy) &&
            (sortDirection === "asc" || sortDirection === "desc")
        ) {
            const sortStage = {};
            sortStage[sortBy] = sortDirection === "asc" ? 1 : -1;

            const topics = await Topic.aggregate([
                // Yazar bilgilerini almak için users koleksiyonu ile join işlemi gerçekleştirelim
                {
                    $lookup: {
                        from: "users", // users koleksiyonu
                        localField: "author", // topics koleksiyonundaki alan
                        foreignField: "_id", // users koleksiyonundaki alan
                        as: "authorDetails", // birleştirilen veri için alias
                    },
                },
                // Unwind işlemi ile authorDetails array'ini açalım
                {
                    $unwind: "$authorDetails",
                },
                // Yorumlar için lookup işlemi
                {
                    $lookup: {
                        from: "comments", // comments koleksiyonu
                        localField: "_id", // topics koleksiyonundaki alan
                        foreignField: "topic", // comments koleksiyonundaki alan
                        as: "comments", // birleştirilen veri için alias
                    },
                },
                // Gruplama işlemi yaparak like, dislike ve yorum sayılarını toplayalım
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        content: 1,
                        "author._id": "$authorDetails._id",
                        "author.username": "$authorDetails.username",
                        likeCount: { $size: "$likes" },
                        dislikeCount: { $size: "$dislikes" },
                        commentCount: { $size: "$comments" },
                        createdAt: 1,
                    },
                },
                // Kullanıcı tarafından belirtilen alana göre sıralama yapalım
                { $sort: sortStage },
            ]).exec(); // .exec() çağrısı ile sorguyu yürütün ve lean kullanın

            if (topics.length === 0) {
                sendResponse(res, 204, "Listelenecek bir gönderi bulunamadı", {
                    topics: [],
                });
                // throw new ApiError("Listelencek bir gönderi yok", 404);
            } else {
                sendResponse(
                    res,
                    200,
                    "Tüm gönderiler başarılı bir şekilde listelendi",
                    { topics }
                );
            }
        } else {
            throw new ApiError("Geçersiz sıralama parametreleri", 400);
        }
    } catch (error) {
        return next(error);
    }
};

export const getTopic = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Topic'i yazar bilgileriyle birlikte bulun
        const topic = await Topic.findById(id)
            .populate("author", "username") // Yazar bilgilerini populate edin
            .lean();

        if (!topic) {
            throw new ApiError("Gönderi bulunamadı", 404);
        }

        // Yorumları ayrıca çekin
        const comments = await Comment.find({ topic: id })
            .populate("author", "username")
            .lean();

        // Her yorum için likeCount ve dislikeCount hesaplayın
        for (let comment of comments) {
            comment.likeCount = comment.likes.length;
            comment.dislikeCount = comment.dislikes.length;
        }

        // Topic'in likeCount ve dislikeCount değerlerini hesaplayın
        topic.likeCount = topic.likes.length;
        topic.dislikeCount = topic.dislikes.length;

        // Topic nesnesine yorumları, yorum sayısını, likeCount ve dislikeCount'u ekleyin
        topic.comments = comments;
        topic.commentCount = comments.length;
        sendResponse(
            res,
            200,
            "Gönderi bilgileri başarılı bir şekilde alındı",
            { topic }
        );
    } catch (error) {
        return next(error);
    }
};

export const addTopic = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const { title, content } = req.body;
        console.log("new topic: ", title, content);
        const topic = await Topic.create({
            title,
            content,
            author: userId,
        });
        const newTopic = await Topic.findById(topic._id)
            .populate("author", "username") // Yazar bilgilerini populate edin
            .lean();
        // Topic'in likeCount ve dislikeCount değerlerini hesaplayın
        topic.likeCount = topic.likes.length;
        topic.dislikeCount = topic.dislikes.length;
        sendResponse(
            res,
            200,
            "Yeni gönderi başarılı bir şekilde kayıt edili",
            { topic: newTopic }
        );
    } catch (error) {
        return next(error);
    }
};

export const deleteTopic = async (req, res, next) => {
    const { id } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user.id);
    try {
        const topic = await Topic.findById(id);

        if (!topic) {
            throw new ApiError("Silinecek gönderi bulunamadı", 404);
        }

        // Kullanıcının kendi topic'ini mi siliyor kontrolü
        if (topic.author.toString() !== userId) {
            throw new ApiError("Bu işlemi yapmaya yetkiniz yok", 403);
        }

        await topic.remove();
        sendResponse(res, 204);
    } catch (error) {
        return next(error);
    }
};

export const likeTopicById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const topicId = req.params.id;
        console.log(
            "likeTopicById çağrıldı. UserId:",
            userId,
            "TopicId:",
            topicId
        );

        const updatedTopic = await likeTopic(userId, topicId);
        console.log("Güncellenmiş topic:", updatedTopic);

        sendResponse(res, 200, "İşlem başarılı", {
            topic: {
                _id: updatedTopic._id,
                likes: updatedTopic.likes,
                dislikes: updatedTopic.dislikes,
            },
        });
    } catch (error) {
        console.error("likeTopicById'de hata:", error);
        return next(new ApiError(error.message || "İşlem başarısız", 400));
    }
};

export const dislikeTopicById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const topicId = req.params.id;
        console.log(
            "dislikeTopicById çağrıldı. UserId:",
            userId,
            "TopicId:",
            topicId
        );

        const updatedTopic = await dislikeTopic(userId, topicId);
        console.log("Güncellenmiş topic:", updatedTopic);

        sendResponse(res, 200, "İşlem başarılı", {
            topic: {
                _id: updatedTopic._id,
                likes: updatedTopic.likes,
                dislikes: updatedTopic.dislikes,
            },
        });
    } catch (error) {
        console.error("dislikeTopicById'de hata:", error);
        return next(new ApiError(error.message || "İşlem başarısız", 400));
    }
};
