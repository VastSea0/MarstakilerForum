import Comment from "../models/comment.js";
import likeComment from "../helpers/likeComment.js";
import dislikeComment from "../helpers/dislikeComment.js";

export const addComment = async (req, res, next) => {
    try {
        const topicId = req.params.id;
        const userId = req.user.id;
        const { content } = req.body;
        if (!content || !topicId) {
            return res.status(400).json({
                success: false,
                errors: "Lütfen geçerli bir yorum yazınız",
            });
        }
        const comment = await Comment.create({
            content,
            author: userId,
            topic: topicId,
        });
        if (comment) {
            // Yeni oluşturulan yorumu populate edin ve döndürün
            const populatedComment = await Comment.findById(
                comment._id
            ).populate("author", "username");
            return res.status(200).json({
                success: true,
                message: "Yorumunuz başarılı bir şekilde eklendi",
                comment: populatedComment,
            });
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

export const likeCommentById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.id;
        console.log(
            `Attempting to like comment: ${commentId} by user: ${userId}`
        );
        await likeComment(userId, commentId)
            .then((comment) => {
                console.log(`Successfully liked comment: ${commentId}`);
                return res.status(200).json({
                    success: true,
                    message: "İşlem başarılı",
                });
            })
            .catch((error) => {
                console.error(`Error liking comment: ${commentId}`, error);
                return res.status(400).json({
                    success: false,
                    errors: "İşlem başarısız: " + error.message,
                });
            });
    } catch (error) {
        console.error(`Unexpected error in likeCommentById`, error);
        return next(error);
    }
};

export const dislikeCommentById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.id;
        await dislikeComment(userId, commentId)
            .then((comment) => {
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
