import { User } from './models/User';
import { Restaurant } from './models/Restaurant';
import { Review } from './models/Review';

const initTables = async () => {
  try {
    await User.sync({force: true});
    await Restaurant.sync({force: true});
    await Review.sync({force: true});

    console.log('all tables created');
  }catch(error: any) {
    console.log('error occured');
    console.log(error);
  }
}