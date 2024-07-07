import jwt from "jsonwebtoken";

const generateToken = (userData, secret_key, exp) => {
    return jwt.sign({ userData }, secret_key, {
        expiresIn: exp,
    });
};

export default generateToken;
