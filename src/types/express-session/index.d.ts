import 'express-session';
import { UserSession } from '../music-box';

declare module 'express-session' {
  //* interface da sessão de usuário. é um merge da interface que já existe no express-session.
  interface SessionData {
    loggedIn: boolean;
    user: UserSession | null;
  }
}
