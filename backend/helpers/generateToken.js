import jwt from "jsonwebtoken"

const generateToken = (userData, exp) => {
    return jwt.sign(
        {userData},
        "secret-key",
        { expiresIn: exp }
      );
}

export default generateToken