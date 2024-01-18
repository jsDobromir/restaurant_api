"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.restaurantRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importStar(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const Restaurant_1 = require("../models/Restaurant");
const utilFunctions_1 = require("../utils/utilFunctions");
const restaurantRouter = express_1.default.Router();
exports.restaurantRouter = restaurantRouter;
const storage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './upload/');
    },
    filename: (req, file, callback) => {
        const filename = 'restaurant' + Date.now().toString() + '' + path_1.default.extname(file.originalname);
        callback(null, filename);
    }
});
const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png') {
        callback(null, true);
    }
    else {
        callback(new multer_1.MulterError("LIMIT_UNEXPECTED_FILE"));
    }
};
const uploadMulter = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter });
const uploadFile = (req, res, next) => {
    const upload = uploadMulter.single('restphoto');
    upload(req, res, (error) => {
        if (error) {
            return next(error);
        }
        return next();
    });
};
const verifyAdmin = (req, res, next) => {
    const jwtToken = (0, utilFunctions_1.extractToken)(req);
    let decoded = (0, utilFunctions_1.verifyJwt)(jwtToken);
    if (decoded && decoded.userRole === 'admin') {
        return next();
    }
    return next(new Error('User is not authorized!'));
};
restaurantRouter.post('/', verifyAdmin, uploadFile, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const name = req.body.name;
    const location = {
        lat: req.body.location.split(';')[0],
        lng: req.body.location.split(';')[1]
    };
    const category = req.body.category;
    const filename = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
    try {
        const restaurant = yield Restaurant_1.Restaurant.create({
            name: name,
            location: { type: 'Point', coordinates: [Number(location.lat), Number(location.lng)] },
            category: category,
            imagePath: filename
        });
        return res.status(201).json({
            error: false,
            user: restaurant.toJSON()
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
restaurantRouter.put('/:restId', verifyAdmin, uploadFile, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restId = req.params.restId;
    console.log(req.body);
    const name = req.body.name;
    const location = {
        lat: req.body.location.split(';')[0],
        lng: req.body.location.split(';')[1]
    };
    const category = req.body.category;
    const filename = (req.file ? req.file.filename : undefined);
    try {
        const restaurant = yield Restaurant_1.Restaurant.findByPk(restId);
        if (!restaurant) {
            return res.status(404).json({
                error: true,
                user: `Restaurant not found!`
            });
        }
        //save restaurant
        restaurant.name = name;
        restaurant.location = { type: 'Point', coordinates: [Number(location.lat), Number(location.lng)] };
        restaurant.category = category;
        if (filename) {
            //delete current file
            const filenameToDelete = path_1.default.join(process.cwd(), 'upload', restaurant.imagePath);
            yield fs_1.promises.unlink(filenameToDelete);
            restaurant.imagePath = filename;
        }
        yield restaurant.save();
        //all good, return status 200
        return res.status(200).json({
            error: false,
            user: restaurant.toJSON()
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: error
        });
    }
}));
restaurantRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurants = yield Restaurant_1.Restaurant.findAll();
        if (!restaurants) {
            return res.status(404).json({
                error: true,
                message: "No restaurants found!"
            });
        }
        res.status(200).json({
            error: false,
            restaurants: restaurants
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: error
        });
    }
}));
restaurantRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    try {
        const restaurant = yield Restaurant_1.Restaurant.findByPk(id);
        if (!restaurant) {
            return res.status(404).json({
                error: true,
                message: 'Restaurant not found'
            });
        }
        return res.status(200).json({
            error: false,
            review: restaurant.toJSON()
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
}));
