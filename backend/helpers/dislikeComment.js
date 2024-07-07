import User from "../models/user.js";
import Comment from "../models/comment.js";

const dislikeComment = async (userId, commentId) => {
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new Error("Böyle bir yorum yok");
        }
        if (!comment.dislikes.includes(userId)) {
            comment.dislikes.push(userId);
            const likeIndex = comment.likes.indexOf(userId);
            if (likeIndex !== -1) {
                comment.likes.splice(likeIndex, 1);
            }
            await comment.save();
        }
        return comment;
    } catch (error) {
        console.error("Error in dislikeComment:", error);
        throw error; // Orijinal hatayı fırlat
    }
};
export default dislikeComment;
