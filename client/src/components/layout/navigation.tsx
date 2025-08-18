import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Beer, Moon, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="border-b border-brew-border bg-brew-dark/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Beer className="text-brew-amber text-2xl" />
              <span className="text-xl font-headline font-bold text-brew-text">
                Prefab Brew Crew
              </span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link href="/blog">
              <span className={`font-medium transition-colors cursor-pointer ${
                location === "/blog" 
                  ? "text-brew-amber" 
                  : "text-brew-text-muted hover:text-brew-amber"
              }`}>
                Blogg
              </span>
            </Link>
            
            <a 
              href="#" 
              className="text-brew-text-muted hover:text-brew-amber transition-colors font-medium"
            >
              Om oss
            </a>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="text-brew-text-muted hover:text-brew-amber">
                    <Shield className="h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-brew-text-muted hover:text-brew-amber"
                >
                  <User className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/admin/login">
                <Button variant="ghost" size="sm" className="text-brew-text-muted hover:text-brew-amber">
                  <Shield className="h-4 w-4" />
                </Button>
              </Link>
            )}
            
            <Button variant="ghost" size="sm" className="text-brew-text-muted hover:text-brew-amber">
              <Moon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
