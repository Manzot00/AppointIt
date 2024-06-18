import { ReactNode } from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import ClientLayout from './ClientLayout';
import SideNav from '@/app/ui/dashboard/sidenav';
import { inter } from '@/app/ui/fonts';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <html lang="en">
        <body>
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <h1 className={`${lusitana.className} text-3xl text-center p-4 bg-white shadow-md rounded-md`}>
              Unauthorized access, please <Link href="/login" className="text-blue-500 underline">login</Link> first!
            </h1>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ClientLayout>
          <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
              <SideNav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
          </div>
        </ClientLayout>
      </body>
    </html>
  );
}