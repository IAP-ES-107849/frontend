import { lazy, Suspense, ReactNode, useEffect, useState } from 'react';
import { CleanLayout } from './layouts/CleanLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

export const routes = [
    {
        path: '/',
        element: <CleanLayout />,
        children: [
            {
                path: '/',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <LandingPage />
                    </Suspense>
                )
            },
            {
                path: '/home',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <HomePage />
                    </Suspense>
                )
            }
        ]
    }
]