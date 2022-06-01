import express, { Application } from 'express';

class App {
  readonly app: Application;

  constructor(){
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    // middlewares aqui
  }

  private routes(): void {
    // rotas aqui
  }
}

export default new App().app;
