//* middleware de configuração do express-session.
import session, { SessionConfig } from 'express-session';

export default session(<SessionConfig>{
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 3600 * 24 * 7, //7 dias
  },
});
