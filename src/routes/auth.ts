import express, {Request, Response} from 'express';
import { User } from '../models/User';
import { hashPassword, signJwt, verifyJwt } from '../utils/utilFunctions';
import bcrypt from 'bcrypt';
import {extractToken} from '../utils/utilFunctions';
import {jwtDecodedInfo, userRole} from '../utils/commonInterfaces';
const authRouter = express.Router();

authRouter.get('/user/:id', async (req: Request, res: Response) => {
  let id: number = parseInt(req.params.id);
  const jwtToken = extractToken(req);
  let decoded = verifyJwt<jwtDecodedInfo>(jwtToken);
  let isAccountOwner = false;
  if (decoded && decoded.id === id) {
    isAccountOwner = true;
  }
  try {
    const user = await User.findByPk(id);
    if (user) {
      return res.status(200).json({
        error: false,
        message: 'User found!',
        user: user.toJSON(),
        isAccountOwner
      });
    }
    else {
      return res.status(404).json({
        error: true,
        message: `User not found!`
      });
    }
  }catch(error: any) {
    return res.status(500).json({
      error: true,
      message: error
    });
  }
});

authRouter.post('/user', async (req: Request, res: Response) => {
  const fullName: string = req.body.fullName;
  const email: string = req.body.email;
  const password: string = req.body.password;
  
  try {
    const hashedPass = await hashPassword(password);
    
    const user = await User.create({
      fullName: fullName,
      email: email,
      password: hashedPass
    });
    return res.status(201).json({
      error: false,
      user: user.toJSON()
    });
  }catch(error: any) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: error
    });
  }
});

authRouter.put('/user/:id', async (req: Request, res: Response) => {
  let id: string = req.params.id;
  try {
    let user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        error: true,
        user: `User not found!`
      });
    }
    const fullName: string = req.body.fullName;
    const email: string = req.body.email;
    if (!fullName || !email) {
      return res.status(404).json({
        error: true,
        message: "All fields are required!"
      });
    }
    user.fullName = fullName;
    user.email = email;
    await user.save();
    return res.status(200).json({
      error: false,
      user: user.toJSON()
    });
  }catch(error: any) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: error
    });
  }
});

authRouter.delete('/user/:id', async (req: Request, res: Response) => {
  let id: string = req.params.id;
  try {
    let user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        error: true,
        user: `User not found!`
      });
    }
    await user.destroy();
    return res.status(200).json({
      error: false,
      user: `User ${user.fullName} is deleted successfully!`
    });
  }catch(error: any) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: error
    });
  }
});

//login route, generate jwt token
authRouter.post('/login', async(req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    let user = await User.findAll({
      where: {
        email: email
      },
      attributes: ['id', 'fullName','email', 'password', 'userRole']
    });
    if (!user.length) {
      return res.status(404).json({
        error: true,
        message: `User not found!`
      });
    }

    const passwordsMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordsMatch) {
      return res.status(401).json({
        error: true,
        message: `Wrong password!`
      });
    }
    const token = signJwt({id: user[0].id, email: user[0].email, userRole: user[0].userRole}, {
      expiresIn: `${process.env.JWT_EXPIRES_IN}m`
    });
    return res.status(200).json({
      error: false,
      message: `Login successfull`,
      token: token,
      user: user[0]
    });
  }catch(error: any) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: error
    });
  } 
});

authRouter.get('/verifytoken', async (req: Request, res: Response) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token: string = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        error: true,
        user: null
      });
    }
    
    const decoded = verifyJwt<{id: number}>(token);
    if (!decoded) {
      return res.status(401).json({
        error: true,
        user: null
      });
    }

    const user = await User.findByPk(decoded.id);
    return res.status(200).json({
      error: false,
      user: user
    })
  }
  return res.status(500).json({
    error: true,
    user: null
  });
});

export {authRouter};