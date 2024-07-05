import Topic from "../models/topic.js";
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
                // Gruplama işlemi yaparak like, dislike ve yorum sayılarını toplayalım
                {
                    $group: {
                        _id: "$_id", // topic id'ye göre grupla
                        title: { $first: "$title" },
                        content: { $first: "$content" },
                        author: { $first: "$author" },
                        authorName: { $first: "$authorDetails.username" },
                        likeCount: {
                            $sum: { $size: { $ifNull: ["$likes", []] } },
                        },
                        dislikeCount: {
                            $sum: { $size: { $ifNull: ["$dislikes", []] } },
                        },
                        commentCount: {
                            $sum: { $size: { $ifNull: ["$comments", []] } },
                        },
                        createdAt: { $first: "$createdAt" },
                    },
                },
                // Kullanıcı tarafından belirtilen alana göre sıralama yapalım
                { $sort: sortStage },
            ]);

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
        const topic = await Topic.findById(id)
            .populate("author", "username") // Yazar bilgisini al, sadece kullanıcı adını al
            .populate({
                path: "comments",
                select: "content user createdAt",
                populate: {
                    path: "user",
                    select: "username",
                }, // Yorum yapan kullanıcının sadece kullanıcı adını al
            });

        if (!topic) {
            return res.status(404).json({
                success: false,
                errors: "Gönderi bulunamadı",
            });
        }

        // Yorum sayısını hesapla
        const commentCount = topic.comments.length;

        // Like ve dislike sayılarını hesapla
        const likeCount = topic.likes.length;
        const dislikeCount = topic.dislikes.length;

        const topicData = {
            _id: topic._id,
            title: topic.title,
            content: topic.content,
            author: topic.author.username,
            comments: topic.comments,
            commentCount,
            likeCount,
            dislikeCount,
        };
        res.status(200).json({
            success: true,
            message: "Gönderi bilgileri başarılı bir şekilde alındı",
            data: topicData,
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
