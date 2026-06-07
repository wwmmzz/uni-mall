export interface AuthUser {
  id: string;
  phone: string;
  role: 'user' | 'admin';
}

export interface JwtPayload {
  sub: string;
  phone: string;
  role: 'user' | 'admin';
}
