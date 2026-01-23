import jwt, { JwtPayload } from "jsonwebtoken";

interface AccessTokenPayload extends JwtPayload {
  userId: string;
}

interface RefreshTokenPayload extends JwtPayload {
  userId: string;
}

export const createAccessToken = (userId: string) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: "15m",
    },
  );
};

export const createRefreshToken = (userId: string) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    },
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!,
    ) as AccessTokenPayload;
  } catch (err) {
    console.error(`Error in token_generators.ts verifyAccessToken: ${err}`);
    return null;
  }
};

export const verifyRefreshToken = (
  token: string,
): RefreshTokenPayload | null => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!,
    ) as RefreshTokenPayload;
  } catch (err) {
    console.error(`Error in token_generators.ts verifyRefreshToken: ${err}`);
    return null;
  }
};
