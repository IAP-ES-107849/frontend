import { useUserStore } from "@/stores/useUserStore";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { UserService } from "@/services/Client/UserService";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const {
    token,
    givenName,
    familyName,
    logout: zustandLogout,
  } = useUserStore();
  const navigate = useNavigate();
  console.log(useUserStore());

  const logout = async () => {
    const response = await UserService.logout();
    return response.data;
  };

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      console.log(data);
      localStorage.removeItem("token");
      zustandLogout(navigate);
      window.location.reload();
    },
    onError: (error) => {
      console.error("Logout falhou:", error);
    },
  });

  const handleLogout = async () => {
    logoutMutation.mutate();
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className="fixed w-full z-10 bg-white shadow-sm transition-all duration-300 ease-linear"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Left Section: Title */}
            <div>
              <h1 className="text-3xl font-extrabold text-blue-600">
                <span className="inline-block bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
                  Todo List
                </span>
              </h1>
            </div>
  
            {/* Right Section: Greeting and Logout */}
            <div className="flex items-center space-x-6">
              {token && (
                <>
                  {/* Greeting Message */}
                  <div className="hidden md:block text-gray-800 text-lg font-bold">
                    Welcome, {givenName} {familyName}
                  </div>
  
                  {/* Logout Button */}
                  <Button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-all"
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
  
      {/* Page Content */}
      <div className="pt-16">
      </div>
    </>
  );
  
  
}