import Search from '@/app/ui/customers/search';
import CustomersTable from '@/app/ui/customers/table';
import { lusitana } from '@/app/ui/fonts';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import db from '@/app/lib/db';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
 
export default async function Page() {
  const session = await getServerSession(authOptions);
  const customers = await db.customer.findMany({
    where: { userId: session?.user.id },
    orderBy: [
      {
        surname: 'asc', // Ordina in ordine alfabetico crescente per il campo 'name'
      },
      {
        name: 'asc', // Poi ordina in ordine alfabetico crescente per il campo 'surname'
      },
    ],
  });

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Customers
      </h1>
      <div className="flex justify-between items-center mb-4 gap-4">
        <Search placeholder="Search customers..." />
        <Link href="/home/customers/add" className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Add
        </Link>
      </div>
      <div className="mt-6">
        <CustomersTable initialCustomers={customers} />
      </div>
    </div>
  );
}