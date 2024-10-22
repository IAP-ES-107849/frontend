import React from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';


export const CleanLayout: React.FC = ({ }) => {
    return (
        <div>
            <header className="px-4 lg:px-6 h-14 flex items-center">
                <a href="/" className="flex items-center justify-center">
                    <span className="sr-only">Acme Inc</span>
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                        <path d="m2 17 10 5 10-5" />
                        <path d="m2 12 10 5 10-5" />
                    </svg>
                </a>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    {/* <Button variant="ghost" className="text-sm font-medium">
                        Features
                    </Button>
                    <Button variant="ghost" className="text-sm font-medium">
                        Pricing
                    </Button> */}
                    <Button variant="ghost" className="text-sm font-medium">
                        Create Account
                    </Button>
                    <Button className="text-sm font-medium">
                        Login
                    </Button>
                </nav>
            </header>
            <main>
                <Outlet /> {/* This is where nested routes will be rendered */}
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    © 2023 Acme Inc. All rights reserved.
                </p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <a className="text-xs hover:underline underline-offset-4" href="#">
                        Terms of Service
                    </a>
                    <a className="text-xs hover:underline underline-offset-4" href="#">
                        Privacy
                    </a>
                </nav>
            </footer>
        </div>
    );
};