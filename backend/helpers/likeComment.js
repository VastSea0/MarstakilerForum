import User from "../models/user.js";
import Comment from "../models/comment.js"

const likeComment = async (userId, commentId) => {
    try {


        const comment = await Comment.findById(commentId)
        if (!comment) {
            throw new Error("Böyle bir yorum yok")
        }

        if (!comment.likes.includes(userId)) {
            comment.likes.push(userId);
            const dislikeIndex = comment.dislikes.indexOf(userId)
            if (dislikeIndex !== -1) {
                comment.dislikes.splice(dislikeIndex, 1);
            }
            await comment.save();
        }
        return comment
    } catch (error) {
        throw new Error("Bir hata oluştu")
    }
}

export default likeComment