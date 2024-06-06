import AppointItLogo from '@/app/ui/appointIt-logo';
import LoginForm from '@/app/ui/login-form';
import Link from 'next/link';
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <Link href="/">
                <AppointItLogo />
            </Link>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}