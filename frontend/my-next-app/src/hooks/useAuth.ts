// hooks/useAuth.ts
import { useEffect, useState } from "react";

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    // Chỉ chạy phía client
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const storedFullName = localStorage.getItem("fullName");
      setUserId(storedUserId);
      setFullName(storedFullName);
    }
  }, []);

  return {
    isLoggedIn: !!userId,
    userId,
    fullName,
  };
}
