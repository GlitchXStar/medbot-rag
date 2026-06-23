"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, getToken, getUser, type User } from "./auth";

/**
 * Auth guard hook for protected pages.
 *
 * Checks if the user is logged in on mount.
 * Redirects to /login if not authenticated.
 * Returns { user, token, loading } for use in the component.
 */
export function useAuthGuard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }

    setUser(getUser());
    setToken(getToken());
    setLoading(false);
  }, [router]);

  return { user, token, loading };
}
