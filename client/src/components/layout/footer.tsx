import { Beer, Instagram, Youtube, Github, Heart, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-brew-border bg-brew-card/50 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Beer className="text-brew-amber text-xl" />
              <span className="font-headline font-bold text-brew-text">
                Prefab Brew Crew
              </span>
            </div>
            <p className="text-brew-text-muted text-sm">
              Brygging med passion og presisjon. Følg våre oppskrifter og tips for å lage øl av høyeste kvalitet hjemme.
            </p>
          </div>
          
          <div>
            <h4 className="font-headline font-semibold text-brew-text mb-4">
              Navigasjon
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-brew-text-muted hover:text-brew-amber text-sm transition-colors cursor-pointer">
                    Hjem
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <span className="text-brew-text-muted hover:text-brew-amber text-sm transition-colors cursor-pointer">
                    Blogg
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-brew-text-muted hover:text-brew-amber text-sm transition-colors cursor-pointer">
                    Om oss
                  </span>
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-brew-text-muted hover:text-brew-amber text-sm transition-colors"
                >
                  Kontakt
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-headline font-semibold text-brew-text mb-4">
              Følg oss
            </h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-brew-text-muted hover:text-brew-amber transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a 
                href="#" 
                className="text-brew-text-muted hover:text-brew-amber transition-colors"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
              <a 
                href="#" 
                className="text-brew-text-muted hover:text-brew-amber transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-brew-border pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-brew-text-muted text-sm mb-4 md:mb-0 flex items-center">
              Bygget med <Heart className="h-4 w-4 text-brew-red mx-1" /> av Prefab Brew Crew
            </p>
            <div className="flex items-center space-x-4">
              <Link href="/admin/login">
                <span className="text-brew-text-muted hover:text-brew-amber text-xs transition-colors cursor-pointer flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </span>
              </Link>
              <p className="text-brew-text-muted text-xs">
                © 2024 Prefab Brew Crew. Alle rettigheter forbeholdt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
