"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/users/me", { withCredentials: true })
      .then((res) => {
        console.log("Đã đăng nhập:", res.data);
        setUser(res.data);
      })
      .catch(() => {
        console.log("Chưa đăng nhập");
        setUser(null);
      });
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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
