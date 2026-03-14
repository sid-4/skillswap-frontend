import { User } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  skills: string[];
}

export interface LoginResponse {
  token: string;
  user: User;
}