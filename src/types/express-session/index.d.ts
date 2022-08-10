import 'express-session';
import { UserSession } from '../music-box';

declare module 'express-session' {
  //* interface da sessão de usuário. é um merge da interface que já existe no express-session.
  interface SessionData {
    loggedIn: boolean;
    user: UserSession | null;
  }

  //* interface de configuração da sessão.
  interface SessionConfig {
    secret: string;
    resave: boolean;
    saveUninitialized: boolean;
    cookie: {
      maxAge: number;
    };
  }
}
