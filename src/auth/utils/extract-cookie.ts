import { Request } from 'express';

interface Cookies {
  access_token?: string;
}

export const cookieExtractor = (req: Request): string | null => {
  const cookies = req.cookies as Cookies | undefined;

  if (cookies?.access_token) {
    return cookies.access_token;
  }

  return null;
};
