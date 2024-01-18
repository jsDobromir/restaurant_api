import express, {NextFunction, Request, Response} from 'express';
import multer, {StorageEngine, FileFilterCallback, MulterError} from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import { Restaurant } from '../models/Restaurant';
import { Restaurant_Type } from '../utils/utilFunctions';
import { Point } from '../utils/commonInterfaces';
import { verifyJwt, extractToken } from '../utils/utilFunctions';
import {jwtDecodedInfo} from '../utils/commonInterfaces';

const restaurantRouter = express.Router();

const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
    callback(null, './upload/');
  },

  filename: (req: Request, file: any, callback) => {
    const filename = 'restaurant' + Date.now().toString() + '' + path.extname(file.originalname);
    callback(null, filename);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  if (file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png') {
          callback(null, true);
        }
  else {
    callback(new MulterError("LIMIT_UNEXPECTED_FILE"));
  }
};

const uploadMulter = multer({storage: storage, fileFilter: fileFilter});

const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  const upload = uploadMulter.single('restphoto');

  upload(req, res, (error) => {
    if (error) {
      return next(error);
    }
    return next();
  });
};

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const jwtToken = extractToken(req);
  let decoded = verifyJwt<jwtDecodedInfo>(jwtToken);
  if (decoded && decoded.userRole === 'admin') {
    return next();
  }
  return next(new Error('User is not authorized!'));
};

restaurantRouter.post('/', verifyAdmin ,uploadFile, async (req: Request, res: Response) => {
  const name: string = req.body.name;
  const location: Point = {
    lat: req.body.location.split(';')[0],
    lng: req.body.location.split(';')[1]
  };

  const category: Array<Restaurant_Type> = req.body.category;
  const filename: (string | undefined) =  req.file?.filename;
  
  try {
    const restaurant = await Restaurant.create({
      name: name,
      location: {type: 'Point', coordinates: [Number(location.lat), Number(location.lng)]},
      category: category,
      imagePath: filename
    });
    return res.status(201).json({
      error: false,
      user: restaurant.toJSON()
    });
  }catch(error: any) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: error
    });
  }
});

restaurantRouter.put('/:restId', verifyAdmin ,uploadFile, async(req: Request, res: Response) => {
  const restId: string = req.params.restId;
  console.log(req.body);
  const name: string = req.body.name;
  const location: Point = {
    lat: req.body.location.split(';')[0],
    lng: req.body.location.split(';')[1]
  };

  const category: Array<Restaurant_Type> = req.body.category;
  const filename: (string | undefined) = (req.file ? req.file.filename : undefined);

  try {
    const restaurant = await Restaurant.findByPk(restId);
    if (!restaurant) {
      return res.status(404).json({
        error: true,
        user: `Restaurant not found!`
      });
    }

    //save restaurant
    restaurant.name = name;
    restaurant.location = {type: 'Point', coordinates: [Number(location.lat), Number(location.lng)]};
    restaurant.category = category;
    if (filename) {
      //delete current file
      const filenameToDelete = path.join(process.cwd(), 'upload', restaurant.imagePath);
      await fs.unlink(filenameToDelete);
      restaurant.imagePath = filename;
    }
    await restaurant.save();
    //all good, return status 200
    return res.status(200).json({
      error: false,
      user: restaurant.toJSON()
    });
  }catch(error: any) {
    return res.status(500).json({
      error: true,
      message: error
    });
  }
});

restaurantRouter.get('/', async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.findAll();
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
  }catch(error: any) {
    return res.status(500).json({
      error: true,
      message: error
    });
  }
});

restaurantRouter.get('/:id', async(req: Request, res: Response) => {
  let id: number = Number(req.params.id);
  try {
    const restaurant = await Restaurant.findByPk(id);
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
  }catch(error: any) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

export {restaurantRouter};
