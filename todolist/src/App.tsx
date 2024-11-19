import './index.css'

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";
// import { ThemeProvider } from "@/components/theme-provider"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { refreshToken } from "@/services/Client/client";
import { Toaster } from './components/ui/toaster';
import { useUserStore } from './stores/useUserStore';

const App = () => {
  const router = createBrowserRouter(routes);
  const queryClient = new QueryClient()
  const token = localStorage.getItem("token");

  if (token) {
    useUserStore.getState().login(token);
  }
  // useEffect(() => {
  //   refreshToken();
  // }, []);

  return (
      <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster />
      </QueryClientProvider>
  )
}

export default App