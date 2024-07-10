import Comment from "../models/comment.js";

const likeComment = async (userId, commentId) => {
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new Error("Böyle bir yorum yok");
        }

        const likeIndex = comment.likes.indexOf(userId);
        const dislikeIndex = comment.dislikes.indexOf(userId);

        if (likeIndex !== -1) {
            // Kullanıcı zaten like atmış, like'ı kaldır
            comment.likes.splice(likeIndex, 1);
            console.log("Like kaldırıldı");
        } else {
            // Kullanıcı like atmamış, like ekle
            comment.likes.push(userId);
            console.log("Like eklendi");

            // Eğer dislike varsa, onu kaldır
            if (dislikeIndex !== -1) {
                comment.dislikes.splice(dislikeIndex, 1);
                console.log("Var olan dislike kaldırıldı");
            }
        }

        console.log("Güncellenmiş yorum:", comment);
        await comment.save();
        return comment;
    } catch (error) {
        console.error("likeComment fonksiyonunda hata:", error);
        throw error;
    }
};

export default likeComment;
