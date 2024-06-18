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
    </main>
  );
}