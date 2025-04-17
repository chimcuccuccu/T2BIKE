"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra trạng thái người dùng một lần khi trang tải
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/users/me", { withCredentials: true });
        console.log("Đã đăng nhập:", res.data);
        setUser(res.data);
      } catch (error) {
        console.log("Chưa đăng nhập");
        setUser(null);
      }
    };

    fetchUser();
  }, []); // Chỉ chạy một lần khi trang được tải

    const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
