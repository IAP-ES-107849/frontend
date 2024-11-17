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
    <nav
      className={`fixed w-full z-10 transition-all duration-300 ease-linear`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Greeting and Logout Section */}
          <div className="flex-1 flex justify-end items-center">
            {token && (
              <div className="flex items-center space-x-6">
                {/* Greeting Message */}
                <div className="hidden md:block text-gray-800 text-lg font-bold">
                  Welcome, {givenName} {familyName}
                </div>
                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all duration-200"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
  
}