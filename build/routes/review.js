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
exports.reviewRouter = void 0;
const express_1 = __importDefault(require("express"));
const Review_1 = require("../models/Review");
const reviewRouter = express_1.default.Router();
exports.reviewRouter = reviewRouter;
reviewRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.body.userId);
    const restaurantId = Number(req.body.restaurantId);
    const rating = Number(req.body.rating);
    const comment = req.body.comment;
    try {
        const review = yield Review_1.Review.create({
            userId: userId,
            restaurantId: restaurantId,
            rating: rating,
            comment: comment
        });
        return res.status(201).json({
            error: false,
            user: review.toJSON()
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
reviewRouter.get('/user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.userId);
    try {
        const reviews = yield Review_1.Review.findAll({
            where: { userId: userId }
        });
        return res.status(200).json({
            error: false,
            reviews: reviews
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
// GET route to get reviews by restaurantId
reviewRouter.get('/restaurant/:restaurantId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantId = Number(req.params.restaurantId);
    try {
        const reviews = yield Review_1.Review.findAll({
            where: { restaurantId: restaurantId }
        });
        return res.status(200).json({
            error: false,
            reviews: reviews
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
// PUT route to edit a review
reviewRouter.put('/:reviewId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewId = Number(req.params.reviewId);
    const newRating = Number(req.body.rating);
    try {
        const review = yield Review_1.Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({
                error: true,
                message: 'Review not found'
            });
        }
        // Update the review's rating
        review.rating = newRating;
        yield review.save();
        return res.status(200).json({
            error: false,
            review: review.toJSON()
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
// DELETE route to delete a review
reviewRouter.delete('/:reviewId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewId = Number(req.params.reviewId);
    try {
        const review = yield Review_1.Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({
                error: true,
                message: 'Review not found'
            });
        }
        // Delete the review
        yield review.destroy();
        return res.status(200).json({
            error: false,
            message: 'Review deleted successfully'
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
