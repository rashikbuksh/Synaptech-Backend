import type { PublicUrlProps } from '@/lib/types';
import type { JWTPayload } from 'hono/utils/jwt/types';

import { compareSync, hash } from 'bcrypt-ts';
import { sign, verify } from 'hono/jwt';

import env from '@/env';

export async function HashPass(password: string) {
  const hashPassword = await hash(password, env.SALT);

  return hashPassword;
}

export async function ComparePass(password: string, hashPassword: string) {
  return compareSync(password, hashPassword);
}

export async function CreateToken(payload: JWTPayload) {
  return sign(payload, env.PRIVATE_KEY);
}

export async function VerifyToken(token: string) {
  const decodedPayload = await verify(token, env.PRIVATE_KEY);

  return !!decodedPayload;
}

export function isPublicRoute(url: string, method: string) {
  const publicUrls: PublicUrlProps[] = [
    { url: '/v1/signin', method: 'POST' },
    { url: '/v1/hr/user/login', method: 'POST' },
    { url: '/v1/portfolio', method: 'GET' },
    { url: '/v1/portfolio/online-admission', method: 'POST' },
    { url: '/v1/portfolio/contact-us', method: 'POST' },
    { url: '/v1/other/', method: 'GET' },
    { url: '/v1/fde/qns', method: 'GET' },
    { url: '/v1/fde/qns-category', method: 'GET' },
    { url: '/v1/fde/respond-student', method: 'POST' },
    { url: '/v1/fde/evaluation', method: 'POST' },
    { url: '/v1/lib/sem-crs-thr-entry/', method: 'GET' },
  ];

  return publicUrls.some(route => url.startsWith(route.url) && route.method === method);
}

export const ALLOWED_ROUTES: string[] = [
  'http://localhost:3005',
  'http://192.168.10.1750',
  'http://192.168.10.58:4090',
  'http://103.147.163.46:4090',
  'http://151.106.120.131',
  'http://151.106.120.131:4030',
  'http://151.106.120.131:3000',
  'https://backend.synaptech.cloud',
  'https://synaptech.cloud',
  'https://www.synaptech.cloud',
  'https://admin.synaptech.cloud',
  'https://synap-erp-starter.vercel.app',
];
