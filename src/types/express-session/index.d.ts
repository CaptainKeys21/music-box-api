import 'express-session';

declare module 'express-session' {
  //* interface da sessão de usuário. é um merge da interface que já existe no express-session.
  interface SessionData {
    loggedIn: boolean;
    user: {
      email: string;
      username: string;
    } | null;
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
