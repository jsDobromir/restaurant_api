import express, {NextFunction, Request, Response} from 'express';
import { sequelize } from './utils/DbConn';
import { authRouter } from './routes/auth';
import { restaurantRouter} from './routes/restaurant';
import { reviewRouter } from './routes/review';
import { verifyJwt } from './utils/utilFunctions';
import dotenv from 'dotenv';
import cors from 'cors';
import { utilsRouter } from './routes/utils';
import { MulterError } from 'multer';

dotenv.config();

const app = express();
app.use(cors<Request>());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.use('/auth', authRouter);
app.use('/utils', utilsRouter);
app.use('/restaurant', restaurantRouter);
app.use('/review', reviewRouter);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof MulterError) {
    return res.status(500).json({message: error.code});
  }
  res.status(500).json({message: error.message});
})

sequelize.authenticate().then(() => {
  console.log('connected to db');

  app.listen(8000, () => {
    console.log('App litening on port 8000');
  });

}).catch((err) => {
  console.log('error occured ' + err);
});
