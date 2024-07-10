import jwt from "jsonwebtoken";

const generateToken = (user, secret_key, exp) => {
    return jwt.sign({ user }, secret_key, {
        expiresIn: exp,
    });
};

export default generateToken;
