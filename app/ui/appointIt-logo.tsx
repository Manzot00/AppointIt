import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AppointItLogo() {
  return (
    <div className={`${lusitana.className} flex flex-wrap items-center leading-none text-white`} >
      <CalendarDaysIcon className="h-20 w-20 " />
      <p className="text-[44px]">AppointIt</p>
    </div>
  );
}
