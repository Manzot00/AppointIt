"use client";

import { signOut } from "next-auth/react";
import { PowerIcon } from '@heroicons/react/24/outline';

export default function SignOutButton() {
    const handleSignOut = () => {
        const confirmSignOut = confirm("Are you sure you want to sign out?");
        if (confirmSignOut) {
            signOut({
                redirect: true,
                callbackUrl: `${window.location.origin}/`
            });
        }
    };

    return (
        <button onClick={handleSignOut}
        className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
        </button>
    );
}