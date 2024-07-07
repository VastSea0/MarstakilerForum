import Topic from "../models/topic.js";
import Comment from "../models/comment.js";
import likeTopic from "../helpers/likeTopic.js";
import dislikeTopic from "../helpers/dislikeTopic.js";
import mongoose from "mongoose";

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
                return res.status(404).json({
                    success: false,
                    errors: "Listelenecek bir gönderi bulunamadı",
                });
            }

            return res.status(200).json({
                success: true,
                messages: "Tüm gönderiler başarılı bir şekilde listelendi",
                data: topics,
            });
        } else {
            return res.status(400).json({
                success: false,
                errors: "Lütfen geçerli parametreler girin!",
            });
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
            return res.status(404).json({
                success: false,
                errors: "Gönderi bulunamadı",
            });
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

        res.status(200).json({
            success: true,
            message: "Gönderi bilgileri başarılı bir şekilde alındı",
            data: topic,
        });
    } catch (error) {
        console.error("Hata:", error);
        return next(error);
    }
};

export const addTopic = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const { title, content } = req.body;
        const topic = await Topic.create({
            title,
            content,
            author: userId,
        });
        if (!topic) {
            return res.status(400).json({
                success: false,
                errors: "Gönderi kayıt edilemedi",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Yeni gönderi başarılı bir şekilde kayıt edildi",
            data: topic,
        });
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

export const deleteTopic = async (req, res, next) => {
    const { id } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user.id);
    try {
        const topic = await Topic.findById(id);

        if (!topic) {
            return res.status(404).json({
                success: false,
                errors: "Gönderi bulunamadı",
            });
        }

        // Kullanıcının kendi topic'ini mi siliyor kontrolü
        if (topic.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                errors: "Bu işlem için yetkiniz yok",
            });
        }

        await topic.remove();

        return res.status(200).json({
            success: true,
            message: "Gönderi başarıyla silindi",
        });
    } catch (error) {
        console.error("Hata:", error);
        return next(error);
    }
};

export const likeTopicById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const topicId = req.params.id;
        await likeTopic(userId, topicId)
            .then((topic) => {
                return res.status(200).json({
                    success: true,
                    message: "İşlem başarılı",
                });
            })
            .catch((error) => {
                return res.status(400).json({
                    success: false,
                    errors: "İşlem başarısız",
                });
            });
    } catch (error) {
        return next(error);
    }
};

export const dislikeTopicById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const topicId = req.params.id;
        await dislikeTopic(userId, topicId)
            .then((topic) => {
                return res.status(200).json({
                    success: true,
                    message: "İşlem başarılı",
                });
            })
            .catch((error) => {
                return res.status(400).json({
                    success: false,
                    errors: "İşlem başarısız",
                });
            });
    } catch (error) {
        return next(error);
    }
};
