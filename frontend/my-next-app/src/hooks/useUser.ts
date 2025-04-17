import { useState, useEffect } from "react";
import { User } from "@/types/user";
import axios from "axios";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/users/me", { withCredentials: true }); // hoặc route bạn dùng để lấy user
        setUser(res.data);
      } catch (error) {
        console.error("Không thể lấy thông tin người dùng:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return user;
}
