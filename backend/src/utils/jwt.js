const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "super-secret-key";

module.exports = {
    generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET,
            { expiresIn: "7d" }
        );
    },

    verifyToken(token) {
        return jwt.verify(token, SECRET);
    }
};
