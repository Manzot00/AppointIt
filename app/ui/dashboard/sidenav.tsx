import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AppointItLogo from '@/app/ui/appointIt-logo';
import SignOutButton from '@/app/ui/dashboard/signout-button';

export default async function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/home"
      >
        <div className="w-40 text-white md:w-40">
          <AppointItLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <SignOutButton />
      </div>
    </div>
  );
}
