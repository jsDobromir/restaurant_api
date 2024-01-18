import express, {Request, Response} from 'express';
import { Review } from '../models/Review';
import { User } from '../models/User';
import { Restaurant } from '../models/Restaurant';

const reviewRouter = express.Router();

reviewRouter.post('/', async(req: Request, res: Response) => {
  const userId: number = Number(req.body.userId);
  const restaurantId: number = Number(req.body.restaurantId);
  const rating: number = Number(req.body.rating);
  const comment: (string | undefined) = req.body.comment;

  try {
    const review = await Review.create({
      userId: userId,
      restaurantId: restaurantId,
      rating: rating,
      comment: comment
    });
    return res.status(201).json({
      error: false,
      user: review.toJSON()
    });
  }catch(error: any) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: error
    });
  }
});

reviewRouter.get('/user/:userId', async(req: Request, res: Response) => {
  const userId: number = Number(req.params.userId);

  try{
    const reviews = await Review.findAll({
      where: { userId: userId }
    });

    return res.status(200).json({
      error: false,
      reviews: reviews
    });
  }catch(error: any) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

// GET route to get reviews by restaurantId
reviewRouter.get('/restaurant/:restaurantId', async (req: Request, res: Response) => {
  const restaurantId: number = Number(req.params.restaurantId);

  try {
    const reviews = await Review.findAll({
      where: { restaurantId: restaurantId }
    });

    return res.status(200).json({
      error: false,
      reviews: reviews
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

// PUT route to edit a review
reviewRouter.put('/:reviewId', async (req: Request, res: Response) => {
  const reviewId: number = Number(req.params.reviewId);
  const newRating: number = Number(req.body.rating);

  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({
        error: true,
        message: 'Review not found'
      });
    }

    // Update the review's rating
    review.rating = newRating;
    await review.save();

    return res.status(200).json({
      error: false,
      review: review.toJSON()
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

// DELETE route to delete a review
reviewRouter.delete('/:reviewId', async (req: Request, res: Response) => {
  const reviewId: number = Number(req.params.reviewId);

  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({
        error: true,
        message: 'Review not found'
      });
    }

    // Delete the review
    await review.destroy();

    return res.status(200).json({
      error: false,
      message: 'Review deleted successfully'
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

export {reviewRouter};