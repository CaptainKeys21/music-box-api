import './database';
import express, { Application, urlencoded } from 'express';
import userRoutes from './controllers/user/user.routes';
import songRoutes from './controllers/song/song.routes';
import loginRoutes from './controllers/login/login.routes';
import profileRoutes from './controllers/profile/profile.routes';
import articleRoutes from './controllers/article/articles/article.routes';
import genreRoutes from './controllers/genre/genre.routes';

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
    this.app.use('/song', songRoutes);
    this.app.use('/login', loginRoutes);
    this.app.use('/profile', profileRoutes);
    this.app.use('/article', articleRoutes);
    this.app.use('/genre', genreRoutes);
  }
}

export default new App().app;
