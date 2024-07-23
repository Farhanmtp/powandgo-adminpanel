import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';

export default async function AccountSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getServerSession(options);

  if (data?.user.role !== 'user') {
    redirect('/dashboard');
  }
  return <>{children}</>;
}
