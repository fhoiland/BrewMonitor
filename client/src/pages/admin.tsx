import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function Admin() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        setLocation("/admin/dashboard");
      } else {
        setLocation("/admin/login");
      }
    }
  }, [isAuthenticated, isLoading, setLocation]);

  return (
    <div className="min-h-screen bg-brew-dark flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-brew-amber" />
    </div>
  );
}
