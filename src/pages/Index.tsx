import { useAuth } from "@/lib/auth-context";

export default function Index() {
  const { role } = useAuth();
  // This page is not used - routing is handled in App.tsx
  return null;
}
