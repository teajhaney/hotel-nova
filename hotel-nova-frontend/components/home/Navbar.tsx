import { cookies } from 'next/headers';
import { NavbarClient } from './NavbarClient';

type JwtPayload = { role?: string; exp?: number };

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const decoded = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

function isRole(role: unknown): role is 'ADMIN' | 'GUEST' {
  return role === 'ADMIN' || role === 'GUEST';
}

export async function Navbar() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  let initialRole: 'ADMIN' | 'GUEST' | null = null;

  if (accessToken) {
    const payload = decodeJwtPayload(accessToken);
    if (isRole(payload?.role)) {
      initialRole = payload.role;
    }
  }

  return <NavbarClient initialRole={initialRole} />;
}
