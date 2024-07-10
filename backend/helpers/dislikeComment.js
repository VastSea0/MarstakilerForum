import Comment from "../models/comment.js";

const dislikeComment = async (userId, commentId) => {
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new Error("Böyle bir yorum yok");
        }

        const likeIndex = comment.likes.indexOf(userId);
        const dislikeIndex = comment.dislikes.indexOf(userId);

        if (dislikeIndex !== -1) {
            // Kullanıcı zaten dislike atmış, dislike'ı kaldır
            comment.dislikes.splice(dislikeIndex, 1);
            console.log("Dislike kaldırıldı");
        } else {
            // Kullanıcı dislike atmamış, dislike ekle
            comment.dislikes.push(userId);
            console.log("Dislike eklendi");

            // Eğer like varsa, onu kaldır
            if (likeIndex !== -1) {
                comment.likes.splice(likeIndex, 1);
                console.log("Var olan like kaldırıldı");
            }
        }

        console.log("Güncellenmiş yorum:", comment);
        await comment.save();
        return comment;
    } catch (error) {
        console.error("dislikeComment fonksiyonunda hata:", error);
        throw error;
    }
};
export default dislikeComment;
