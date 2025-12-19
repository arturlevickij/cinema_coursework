const AuthService = require("../services/auth.service");

class AuthController {
    static async register(req, res) {
        try {
            const user = await AuthService.register(req.body); 
            res.json({
                message: "User registered",
                user
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static async login(req, res) {
        console.log("LOGIN BODY ->", req.body);
        try {
            const token = await AuthService.login(req.body);

            res.json({
                message: "Logged in successfully",
                token
            });
        } catch (err) {
            console.log("LOGIN ERROR ->", err.message);
            res.status(400).json({ error: err.message });
        }
    }

    static async me(req, res) {
        try {
            res.json(req.user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = AuthController;
