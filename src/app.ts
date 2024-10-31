import express, { Request, Response, Application } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import profileRouter from './routes/profileRoutes';
import storiesRouter from './routes/storiesRoutes';
import { AppError } from './utility';
import { globalErrorHandler } from './controllers';
import StoriesRoutes from './routes/storiesRoutes';

export default async (app: Application) => {
  app.use(express.static(path.join(__dirname, '../public')));
  //Implement CORS
  app.use(cors());
  app.options('*', cors());
  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP,please try in an hour',
  });
  app.use('/api', limiter);
  app.use(compression()); //for text send in responses
  app.use(cookieParser());
  app.use(express.json({ limit: '100mb' })); // 10 kilo byte as max for denial attacks
  app.use(express.urlencoded({ extended: true, limit: '100mb' })); // for sending requests from forms

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  // TODO: Add your routes here
  app.use('/api/v1/profile', profileRouter);
  app.use('/api/v1/stories', storiesRouter);
  app.get('/', (req: Request, res: Response) => {
    console.log('hello world');
    res.status(200).json({ msg: 'hello world,MAZROF COMMUNITY' });
  });
  app.all('*', (req, res, next) => {
    const err = new AppError(
      `Can't find ${req.originalUrl} on this server`,
      404
    );
    next(err);
  });
  app.use(globalErrorHandler);
  return app;
};
