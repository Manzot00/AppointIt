import HomeView from '../ui/dashboard/home-view';
import { lusitana } from '@/app/ui/fonts';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';

export default async function Page() {
  const session = await getServerSession(authOptions);
  //console.log(session);
  
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Welcome to your Home Page, {session?.user.username}!
      </h1>
      <HomeView />
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      </div>
    </main>
  );
}