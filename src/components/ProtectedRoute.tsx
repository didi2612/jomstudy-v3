import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = !!document.cookie
    .split("; ")
    .find((row) => row.startsWith("username="));

  if (!isLoggedIn) {
    return <Navigate to="/azp" replace />;
  }

  return <>{children}</>;
}
