import { Link, useLocation } from "wouter";
import { Beer, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();

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
            
            <Button variant="ghost" size="sm" className="text-brew-text-muted hover:text-brew-amber">
              <Moon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
