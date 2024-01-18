"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DbConn_1 = require("./utils/DbConn");
const auth_1 = require("./routes/auth");
const restaurant_1 = require("./routes/restaurant");
const review_1 = require("./routes/review");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const utils_1 = require("./routes/utils");
const multer_1 = require("multer");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
app.use('/auth', auth_1.authRouter);
app.use('/utils', utils_1.utilsRouter);
app.use('/restaurant', restaurant_1.restaurantRouter);
app.use('/review', review_1.reviewRouter);
app.use((error, req, res, next) => {
    if (error instanceof multer_1.MulterError) {
        return res.status(500).json({ message: error.code });
    }
    res.status(500).json({ message: error.message });
});
DbConn_1.sequelize.authenticate().then(() => {
    console.log('connected to db');
    app.listen(8000, () => {
        console.log('App litening on port 8000');
    });
}).catch((err) => {
    console.log('error occured ' + err);
});
