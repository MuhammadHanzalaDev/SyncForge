import { JwtPayload } from "jsonwebtoken";

interface AuthJwtPayload extends JwtPayload {
  userId: string;
}

export { AuthJwtPayload };
