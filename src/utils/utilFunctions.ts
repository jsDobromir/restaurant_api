import bcrypt from 'bcrypt';
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { Request } from 'express';

const hashPassword = async (password: string): Promise<string> => {
  let salt = await bcrypt.genSalt(10);
  let hashedPass = await bcrypt.hash(password, salt);
  return hashedPass;
}

const signJwt = (payload: Object, options: SignOptions): string => {
  let secretKey: Secret = (process.env.JWT_SECRET) ? process.env.JWT_SECRET : 'defaultsecretstringifjwtsecretnone';
  return jwt.sign(payload, secretKey, {
    ...(options && options),
    algorithm: 'HS256'
  });
}

const verifyJwt = <T>(token: string): T | null => {
  let secretKey: Secret = (process.env.JWT_SECRET) ? process.env.JWT_SECRET : 'defaultsecretstringifjwtsecretnone';
  try {
    const decoded = jwt.verify(token, secretKey) as T;
    return decoded;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const extractToken = (req: Request): string => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  return '';
}

enum Restaurant_Type {
  FINE_DINING_RESTAURANT = 'Fine Dining Restaurant',
  CASUAL_DINING_RESTAURANT = 'Casual Dining Restaurant',
  FAST_CASUAL_RESTAURANT = 'Fast Casual Restaurant',
  FAST_FOOD_RESTAURANT = 'Fast Food Restaurant',
  FAMILY_STYLE_RESTAURANT = 'Family Style Restaurant',
  CAFE_RESTAURANT = 'Cafe Restaurant',
  BISTRO_RESTAURANT = 'Bistro Restaurant',
  BUFFET_RESTAURANT = 'Buffet Restaurant',
  SPECIALITY_RESTAURANT = 'Speciality Restaurant',
  STREET_FOOD_VENDOR = 'Street Food Vendor',
  VEGETERIAN_RESTAURANT = 'Vegeterian Restaurant',
  SEAFOOD_RESTAURANT = 'Seafood Restaurant',
  STEAKHOUSE = 'Steakhouse',
  Pizzeria = 'Pizzeria'
};

export {hashPassword, signJwt, verifyJwt, extractToken, Restaurant_Type};