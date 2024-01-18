"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const utilFunctions_1 = require("../utils/utilFunctions");
const bcrypt_1 = __importDefault(require("bcrypt"));
const utilFunctions_2 = require("../utils/utilFunctions");
const authRouter = express_1.default.Router();
exports.authRouter = authRouter;
authRouter.get('/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = parseInt(req.params.id);
    const jwtToken = (0, utilFunctions_2.extractToken)(req);
    let decoded = (0, utilFunctions_1.verifyJwt)(jwtToken);
    let isAccountOwner = false;
    if (decoded && decoded.id === id) {
        isAccountOwner = true;
    }
    try {
        const user = yield User_1.User.findByPk(id);
        if (user) {
            return res.status(200).json({
                error: false,
                message: 'User found!',
                user: user.toJSON(),
                isAccountOwner
            });
        }
        else {
            return res.status(404).json({
                error: true,
                message: `User not found!`
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: error
        });
    }
}));
authRouter.post('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const hashedPass = yield (0, utilFunctions_1.hashPassword)(password);
        const user = yield User_1.User.create({
            fullName: fullName,
            email: email,
            password: hashedPass
        });
        return res.status(201).json({
            error: false,
            user: user.toJSON()
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: error
        });
    }
}));
authRouter.put('/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    try {
        let user = yield User_1.User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                error: true,
                user: `User not found!`
            });
        }
        const fullName = req.body.fullName;
        const email = req.body.email;
        if (!fullName || !email) {
            return res.status(404).json({
                error: true,
                message: "All fields are required!"
            });
        }
        user.fullName = fullName;
        user.email = email;
        yield user.save();
        return res.status(200).json({
            error: false,
            user: user.toJSON()
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: error
        });
    }
}));
authRouter.delete('/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    try {
        let user = yield User_1.User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                error: true,
                user: `User not found!`
            });
        }
        yield user.destroy();
        return res.status(200).json({
            error: false,
            user: `User ${user.fullName} is deleted successfully!`
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: error
        });
    }
}));
//login route, generate jwt token
authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    try {
        let user = yield User_1.User.findAll({
            where: {
                email: email
            },
            attributes: ['id', 'fullName', 'email', 'password', 'userRole']
        });
        if (!user.length) {
            return res.status(404).json({
                error: true,
                message: `User not found!`
            });
        }
        const passwordsMatch = yield bcrypt_1.default.compare(password, user[0].password);
        if (!passwordsMatch) {
            return res.status(401).json({
                error: true,
                message: `Wrong password!`
            });
        }
        const token = (0, utilFunctions_1.signJwt)({ id: user[0].id, email: user[0].email, userRole: user[0].userRole }, {
            expiresIn: `${process.env.JWT_EXPIRES_IN}m`
        });
        return res.status(200).json({
            error: false,
            message: `Login successfull`,
            token: token,
            user: user[0]
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: error
        });
    }
}));
authRouter.get('/verifytoken', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                error: true,
                user: null
            });
        }
        const decoded = (0, utilFunctions_1.verifyJwt)(token);
        if (!decoded) {
            return res.status(401).json({
                error: true,
                user: null
            });
        }
        const user = yield User_1.User.findByPk(decoded.id);
        return res.status(200).json({
            error: false,
            user: user
        });
    }
    return res.status(500).json({
        error: true,
        user: null
    });
}));
