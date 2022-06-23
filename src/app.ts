import './database';
import express, { Application, urlencoded } from 'express';
import userRoutes from './routes/user.routes';
import loginRoutes from './routes/login.routes';

import sessionConfig from './middlewares/sessionConfig';
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
  }

  private routes(): void {
    this.app.use('/user', userRoutes);
    this.app.use('/login', loginRoutes);
  }
}

export default new App().app;
