import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getServerSession(options);

  if (data?.user.role !== 'admin') {
    redirect('/dashboard');
  }
  return <>{children}</>;
}
