import './database';
import express, { Application, urlencoded } from 'express';
import userRoutes from './routes/user.routes';
import loginRoutes from './routes/login.routes';
import profileRoutes from './routes/profile.routes';
import articleRoutes from './routes/articles/article.routes';

import sessionConfig from './middlewares/sessionConfig';
import { resolve } from 'path';
class App {
  readonly app: Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(sessionConfig);
    this.app.use(express.static(resolve(__dirname, '..', 'static')));
  }

  private routes(): void {
    this.app.use('/user', userRoutes);
    this.app.use('/login', loginRoutes);
    this.app.use('/profile', profileRoutes);
    this.app.use('/article', articleRoutes);
  }
}

export default new App().app;
