"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const FormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    surname: z.string().min(1, 'Surname is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    phoneNumber: z.string().optional(),
});

interface Customer {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber?: string;
}

interface EditCustomerFormProps {
  id: string;
}

export default function EditCustomerForm({ id }: EditCustomerFormProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    if (id) {
      const fetchCustomer = async () => {
        const response = await fetch(`/api/edit/customer/${id}`);
        const data = await response.json();
        setCustomer(data.customer);
        reset({
            name: data.customer.name,
            surname: data.customer.surname,
            email: data.customer.email,
            phoneNumber: data.customer.phoneNumber || '',
          });
      };

      fetchCustomer();
    }
  }, [id, reset]);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
      const response = await fetch(`/api/edit/customer/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: values.name,
            surname: values.surname,
            email: values.email,
            phoneNumber: values.phoneNumber,
        }),
      });
      if (response.ok) {
        router.push('/home/customers');
      } else {
        console.error('Failed to update customer');
      }
  };

  //per evitare che il form venga renderizzato prima che i dati del cliente siano stati caricati (da cambiare con suspense e fallback skeleton)
  if (!customer) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full mt-8 bg-gray-50 p-6 rounded-md shadow-md">
      <form className="space-y-3 w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Surname
          </label>
          <input
            type="text"
            {...register('surname')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        {errors.surname && <span className="text-red-500 text-xs">{errors.surname.message}</span>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            {...register('phoneNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <hr />
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Go Back
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}