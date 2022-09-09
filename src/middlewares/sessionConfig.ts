//* middleware de configuração do express-session.
import session from 'express-session';

const secret = process.env.SESSION_SECRET as string;

export default session({
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 3600 * 24 * 7, //7 dias
  },
});
