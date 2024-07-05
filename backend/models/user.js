import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "user", "mod"],
            default: "user",
        },
    },
    { timestamps: true }
);

// Şifreyi kaydetmeden önce hash'lemek için pre-save middleware
userSchema.pre("save", async function (next) {
    const user = this; // 'this' keyword'u burada user document'ini işaret eder
    if (!user.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        user.password = await bcrypt.hash(user.password, salt);
        return next();
    } catch (error) {
        return next(error);
    }
});

// User modelinde verifyPassword metodunu tanımlayın
userSchema.methods.verifyPassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
