// backend/src/types/express/index.d.ts

import { User } from "../../utils/generateTokenAndSetCookies";

declare global {
  namespace Express {
    interface Request {
      user?: User; 
    }
  }
}

export {};
