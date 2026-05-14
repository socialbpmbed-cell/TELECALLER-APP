import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE = 'li_session';
const SESSION_TTL_S = 86400; // 24 hours

function getSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error('SESSION_SECRET env var is required');
  return s;
}

function sign(payload) {
  const data = JSON.stringify(payload);
  const sig = createHmac('sha256', getSecret()).update(data).digest('hex');
  return `${Buffer.from(data).toString('base64url')}.${sig}`;
}

function unsign(token) {
  try {
    const dot = token.lastIndexOf('.');
    if (dot < 0) return null;
    const encoded = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const data = Buffer.from(encoded, 'base64url').toString();
    const expected = createHmac('sha256', getSecret()).update(data).digest('hex');
    const a = Buffer.from(sig.padEnd(64, '0'), 'hex');
    const b = Buffer.from(expected, 'hex');
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function setSession(email) {
  const jar = await cookies();
  const payload = { email, exp: Date.now() + SESSION_TTL_S * 1000 };
  jar.set(COOKIE, sign(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_TTL_S,
    path: '/',
  });
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const payload = unsign(token);
  if (!payload || payload.exp < Date.now()) return null;
  return payload;
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
