interface JwtPayload {
  iat: number;
  exp: number;
}

export interface AccessTokenPayloadDto extends JwtPayload {
  userId: string;
}
