"use client";
import { useUserProfileQuery } from "@/apis/queries/user_queries";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: React.ReactNode;
}

const UserProvider = ({ children }: AuthProviderProps) => {
  const { isLoading, data } = useUserProfileQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user: data?.data, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default UserProvider;
