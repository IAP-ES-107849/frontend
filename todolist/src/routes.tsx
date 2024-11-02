import { CleanLayout } from "./layouts/CleanLayout";
import { lazy, Suspense, ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "@/stores/useUserStore";

function ProtectedRoute({
    children,
    loggedIn = true,
    redirect = import.meta.env.VITE_LOGIN_SIGN_UP,
}: {
    children: ReactNode;
    loggedIn?: boolean;
    redirect?: string;
}) {
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useUserStore((state: string) => state);

    useEffect(() => {
        setIsLoading(false);
    }, [token]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (loggedIn && !token) {
        return <Navigate to={redirect} />;
    } else if (!loggedIn && token) {
        return <Navigate to="/" />;
    }

    return children;
}

const HomePage = lazy(() => import('./pages/HomePage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const RedirectPage = lazy(() => import('./pages/RedirectPage'));

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
                    <ProtectedRoute>
                        <Suspense fallback={<div>Loading...</div>}>
                            <HomePage />
                        </Suspense>
                    </ProtectedRoute>
                )
            }
        ]
    },
    {
        path: "/oauth2/idpresponse",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <RedirectPage />
          </Suspense>
        ),
      },

]