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
exports.utilsRouter = void 0;
const express_1 = __importDefault(require("express"));
const utilFunctions_1 = require("../utils/utilFunctions");
const utilsRouter = express_1.default.Router();
exports.utilsRouter = utilsRouter;
utilsRouter.get('/getCategories', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('categories');
    let categories = [utilFunctions_1.Restaurant_Type.FINE_DINING_RESTAURANT, utilFunctions_1.Restaurant_Type.CASUAL_DINING_RESTAURANT, utilFunctions_1.Restaurant_Type.FAST_CASUAL_RESTAURANT, utilFunctions_1.Restaurant_Type.FAST_FOOD_RESTAURANT,
        utilFunctions_1.Restaurant_Type.FAMILY_STYLE_RESTAURANT, utilFunctions_1.Restaurant_Type.CAFE_RESTAURANT, utilFunctions_1.Restaurant_Type.BISTRO_RESTAURANT, utilFunctions_1.Restaurant_Type.BUFFET_RESTAURANT,
        utilFunctions_1.Restaurant_Type.SPECIALITY_RESTAURANT, utilFunctions_1.Restaurant_Type.STREET_FOOD_VENDOR, utilFunctions_1.Restaurant_Type.VEGETERIAN_RESTAURANT, utilFunctions_1.Restaurant_Type.SEAFOOD_RESTAURANT,
        utilFunctions_1.Restaurant_Type.STEAKHOUSE, utilFunctions_1.Restaurant_Type.Pizzeria];
    return res.status(200).json({
        error: false,
        categories: categories
    });
}));
