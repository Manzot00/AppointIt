import AddCustomerForm from '@/app/ui/customers/add-customer-form';
import { lusitana } from '@/app/ui/fonts';

export default function EditCustomerPage() {

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-4 text-2xl`}>
        <span className="text-gray-500">Customers /</span> <span>Add</span>
      </h1>
      <AddCustomerForm />
    </div>
  );
}