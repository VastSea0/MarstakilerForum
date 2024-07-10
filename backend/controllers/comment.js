import Comment from "../models/comment.js";
import likeComment from "../helpers/likeComment.js";
import dislikeComment from "../helpers/dislikeComment.js";
import sendResponse from "../helpers/sendResponse.js";
import ApiError from "../helpers/apiError.js";

export const addComment = async (req, res, next) => {
    try {
        const topicId = req.params.id;
        const userId = req.user.id;
        const { content } = req.body;
        if (!content || !topicId) {
            throw new ApiError("Yorum içeriği boş olamaz", 400);
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

            if (populatedComment) {
                sendResponse(res, 201, "Yorum başarıyla oluşturuldu", {
                    comment: populatedComment,
                });
            } else {
                throw new ApiError("Yorum bulunamadı", 404);
            }
        } else {
            throw new ApiError("Yorum oluşturulurken bir hata oluştu", 500);
        }
    } catch (error) {
        return next(error);
    }
};

export const likeCommentById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.id;
        console.log(
            "likeCommentById çağrıldı. UserId:",
            userId,
            "CommentId:",
            commentId
        );

        const updatedComment = await likeComment(userId, commentId);
        console.log("Güncellenmiş yorum:", updatedComment);

        sendResponse(res, 200, "İşlem başarılı", {
            comment: {
                _id: updatedComment._id,
                likes: updatedComment.likes,
                dislikes: updatedComment.dislikes,
            },
        });
    } catch (error) {
        console.error("likeCommentById'de hata:", error);
        return next(new ApiError(error.message || "İşlem başarısız", 400));
    }
};
export const dislikeCommentById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.id;
        console.log(
            "dislikeCommentById çağrıldı. UserId:",
            userId,
            "CommentId:",
            commentId
        );

        const updatedComment = await dislikeComment(userId, commentId);
        console.log("Güncellenmiş yorum:", updatedComment);

        sendResponse(res, 200, "İşlem başarılı", {
            comment: {
                _id: updatedComment._id,
                likes: updatedComment.likes,
                dislikes: updatedComment.dislikes,
            },
        });
    } catch (error) {
        console.error("dislikeCommentById'de hata:", error);
        return next(new ApiError(error.message || "İşlem başarısız", 400));
    }
};
