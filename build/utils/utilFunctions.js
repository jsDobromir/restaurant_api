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
exports.Restaurant_Type = exports.extractToken = exports.verifyJwt = exports.signJwt = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    let salt = yield bcrypt_1.default.genSalt(10);
    let hashedPass = yield bcrypt_1.default.hash(password, salt);
    return hashedPass;
});
exports.hashPassword = hashPassword;
const signJwt = (payload, options) => {
    let secretKey = (process.env.JWT_SECRET) ? process.env.JWT_SECRET : 'defaultsecretstringifjwtsecretnone';
    return jsonwebtoken_1.default.sign(payload, secretKey, Object.assign(Object.assign({}, (options && options)), { algorithm: 'HS256' }));
};
exports.signJwt = signJwt;
const verifyJwt = (token) => {
    let secretKey = (process.env.JWT_SECRET) ? process.env.JWT_SECRET : 'defaultsecretstringifjwtsecretnone';
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        return decoded;
    }
    catch (error) {
        console.log(error);
        return null;
    }
};
exports.verifyJwt = verifyJwt;
const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return '';
};
exports.extractToken = extractToken;
var Restaurant_Type;
(function (Restaurant_Type) {
    Restaurant_Type["FINE_DINING_RESTAURANT"] = "Fine Dining Restaurant";
    Restaurant_Type["CASUAL_DINING_RESTAURANT"] = "Casual Dining Restaurant";
    Restaurant_Type["FAST_CASUAL_RESTAURANT"] = "Fast Casual Restaurant";
    Restaurant_Type["FAST_FOOD_RESTAURANT"] = "Fast Food Restaurant";
    Restaurant_Type["FAMILY_STYLE_RESTAURANT"] = "Family Style Restaurant";
    Restaurant_Type["CAFE_RESTAURANT"] = "Cafe Restaurant";
    Restaurant_Type["BISTRO_RESTAURANT"] = "Bistro Restaurant";
    Restaurant_Type["BUFFET_RESTAURANT"] = "Buffet Restaurant";
    Restaurant_Type["SPECIALITY_RESTAURANT"] = "Speciality Restaurant";
    Restaurant_Type["STREET_FOOD_VENDOR"] = "Street Food Vendor";
    Restaurant_Type["VEGETERIAN_RESTAURANT"] = "Vegeterian Restaurant";
    Restaurant_Type["SEAFOOD_RESTAURANT"] = "Seafood Restaurant";
    Restaurant_Type["STEAKHOUSE"] = "Steakhouse";
    Restaurant_Type["Pizzeria"] = "Pizzeria";
})(Restaurant_Type || (exports.Restaurant_Type = Restaurant_Type = {}));
;
