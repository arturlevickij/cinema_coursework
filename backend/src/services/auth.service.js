const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserRepository = require("../repositories/user.repository");

class AuthService {
    static async register({ name, email, password }) {

        const existing = await UserRepository.findByEmail(email);
        if (existing) throw new Error("User already exists");

        const hashed = bcrypt.hashSync(password, 10);

        const user = await UserRepository.createUser({
            name,
            email,
            password_hash: hashed,
            role: "user"
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
    }

    static async login({ email, password }) {

        const user = await UserRepository.findByEmail(email);
        if (!user) throw new Error("User not found");

        const match = bcrypt.compareSync(password, user.password_hash);
        if (!match) throw new Error("Wrong password");

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return token;
    }
}

module.exports = AuthService;
