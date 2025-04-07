"use client"
import { createContext, useState, useEffect, ReactNode, useContext } from 'react';

interface AuthContextType {
    user: any;
    setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Kiểm tra localStorage khi tải lại trang
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          console.log("User đã được lưu vào localStorage:", JSON.parse(user)); // In ra thông tin người dùng
      } else {
          console.log("Không tìm thấy user trong localStorage"); // Nếu không có user
      }
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: any) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Lưu user vào localStorage
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Xóa user khỏi localStorage
    };

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
