import React from 'react';
import { Outlet } from 'react-router-dom';


export const CleanLayout: React.FC = () => {
    return (
        <div>
            <main>
                <Outlet /> {/* This is where nested routes will be rendered */}
            </main>
            {/* <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
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
            </footer> */}
        </div>
    );
};