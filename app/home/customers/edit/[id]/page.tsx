import EditCustomerForm from '@/app/ui/customers/edit-customer-form';
import { lusitana } from '@/app/ui/fonts';

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-4 text-2xl`}>
        <span className="text-gray-500">Customers /</span> <span>Edit</span>
      </h1>
      <EditCustomerForm id={id} />
    </div>
  );
}