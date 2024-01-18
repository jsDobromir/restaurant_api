import express, {Request, Response} from 'express';
import { Restaurant_Type } from '../utils/utilFunctions';

const utilsRouter = express.Router();

utilsRouter.get('/getCategories', async(req: Request, res: Response) => {
  console.log('categories');
  let categories = [Restaurant_Type.FINE_DINING_RESTAURANT, Restaurant_Type.CASUAL_DINING_RESTAURANT, Restaurant_Type.FAST_CASUAL_RESTAURANT, Restaurant_Type.FAST_FOOD_RESTAURANT,
                    Restaurant_Type.FAMILY_STYLE_RESTAURANT, Restaurant_Type.CAFE_RESTAURANT, Restaurant_Type.BISTRO_RESTAURANT, Restaurant_Type.BUFFET_RESTAURANT,
                    Restaurant_Type.SPECIALITY_RESTAURANT, Restaurant_Type.STREET_FOOD_VENDOR, Restaurant_Type.VEGETERIAN_RESTAURANT, Restaurant_Type.SEAFOOD_RESTAURANT,
                    Restaurant_Type.STEAKHOUSE, Restaurant_Type.Pizzeria];
  return res.status(200).json({
    error: false,
    categories: categories
  })
});

export {utilsRouter};