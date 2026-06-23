/**
 * MedBot API Client
 *
 * Centralized fetch wrappers for auth and chat endpoints.
 * All calls target the Flask backend at NEXT_PUBLIC_BACKEND_URL.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

/* ─── Types ────────────────────────────────────────────────── */

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    full_name: string;
  };
  error?: string;
}

export interface ChatSource {
  id: string;
  title: string;
  page: string;
  excerpt: string;
  confidence: number;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
  error?: string;
}

/* ─── Auth ─────────────────────────────────────────────────── */

export async function apiLogin(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || "Login failed" };
    }

    return data;
  } catch {
    return { success: false, error: "Unable to connect to server" };
  }
}

export async function apiRegister(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || "Registration failed" };
    }

    return data;
  } catch {
    return { success: false, error: "Unable to connect to server" };
  }
}

/* ─── Chat ─────────────────────────────────────────────────── */

export async function apiChat(
  message: string,
  token: string
): Promise<ChatResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        answer: "",
        sources: [],
        error: data.error || "Failed to get response",
      };
    }

    return data;
  } catch {
    return {
      answer: "",
      sources: [],
      error: "Unable to connect to server. Is the backend running?",
    };
  }
}