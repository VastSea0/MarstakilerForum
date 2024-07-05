import Comment from "../models/comment.js"

export const addComment = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { content, topicId } = req.body
        if (!content || !topicId) {
            return res.status(400).json({
                success: false,
                errors: "Lütfen geçerli bir yorum yazınız"
            })
        }
        const comment = await Comment.create({content, author: userId, topic: topicId })
        if (comment) {
            return res.status(200).json({
                success: true,
                message: "Yorumunuz başarılı bir şekilde eklendi"
            })
        } else {
            return res.status(400).json({
                success: false,
                errors: "Yorumunuz eklenemedi"
            })
        }
    } catch (error) {
        console.log(error)
        return next(error)
    }
}