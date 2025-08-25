import Navigation from "@/components/layout/navigation";
import { Beer } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-brew-dark text-brew-text">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Beer className="text-brew-amber text-6xl" />
          </div>
          <h1 className="text-5xl font-headline font-bold mb-6 text-brew-text">
            Om oss – Prefab Brew Crew 🍻
          </h1>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-brew-card border border-brew-border rounded-lg p-8 space-y-6">
            <p className="text-xl text-brew-text-muted leading-relaxed">
              Hei, og velkommen til bryggeriet vårt! Vi er bare en gjeng som elsker øl – ikke bare å drikke det, men å nerde på prosessen, prøve nye oppskrifter og se hva som funker (og hva som ikke gjør det).
            </p>
            
            <p className="text-xl text-brew-text-muted leading-relaxed">
              Her deler vi alt fra små triumfer til store tabber, oppskrifter vi digger, og tips vi plukker opp underveis. Målet vårt er enkelt: å ha det gøy med brygginga og kanskje inspirere andre til å hive seg på.
            </p>
            
            <p className="text-xl text-brew-text-muted leading-relaxed">
              Så bli med på reisen – det blir mye skum, litt søl og (forhåpentligvis) masse godt øl! 🍺
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center bg-gradient-to-r from-brew-amber/10 to-brew-amber/5 border border-brew-amber/20 rounded-lg p-12">
          <h2 className="text-3xl font-headline font-bold mb-6">
            Bli med oss
          </h2>
          <p className="text-xl text-brew-text-muted mb-8 max-w-2xl mx-auto">
            Har du lyst til å være med på bryggeeventyret? Ta kontakt!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:kontakt@prefabbrewcrew.no" 
              className="bg-brew-amber text-brew-dark px-8 py-3 rounded-lg font-bold hover:bg-brew-amber/90 transition-colors"
            >
              Kontakt oss
            </a>
            <a 
              href="/blog" 
              className="border border-brew-amber text-brew-amber px-8 py-3 rounded-lg font-bold hover:bg-brew-amber/10 transition-colors"
            >
              Les bloggen vår
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}