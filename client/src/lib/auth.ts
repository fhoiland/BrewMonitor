export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
  };
}

export interface User {
  id: string;
  username: string;
}
