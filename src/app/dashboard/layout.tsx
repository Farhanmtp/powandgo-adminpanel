import AppSidebar from '@/components/Base/AppSidebar';
import { getServerSession } from 'next-auth';
import options from '../api/auth/[...nextauth]/options';
// import AppNotification from '@/components/Notifications/AppNotification';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getServerSession(options);
  let role = data?.user.role || '';
  let userId = data?.user.detail.id;
  return (
    <section className="flex-1 flex flex-col">
      <AppSidebar role={role} userId={userId} />
      <div className="md:ml-[268px] sm:px-[40px] sm:py-[10px] flex flex-col flex-1">
        {children}
      </div>
      {/* <AppNotification /> */}
    </section>
  );
}
