const authService = require('../services/authService');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, image } = req.body;
        const newUser = await authService.registerUser(name, email, password, image);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService.loginUser(email, password);
        res.json({ token, user });
    } catch (error) {
        next(error);
    }
};