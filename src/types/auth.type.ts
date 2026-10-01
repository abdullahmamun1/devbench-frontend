import type { User } from "./user.type";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}
