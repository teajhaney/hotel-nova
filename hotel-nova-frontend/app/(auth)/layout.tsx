import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value || cookieStore.get('jwt')?.value;
  const role = cookieStore.get('role')?.value;

  // Guest routes redirect to / if already logged in as GUEST
  if (token && role === 'GUEST') {
    redirect('/');
  }

  return <>{children}</>;
}
