import Navigation from "@/components/layout/navigation";
import { Beer, Users, Trophy, Heart, Target, Zap } from "lucide-react";

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
            Om Prefab Brew Crew
          </h1>
          <p className="text-xl text-brew-text-muted max-w-3xl mx-auto leading-relaxed">
            Vi er en lidenskapelig gruppe hjemmebrygger som deler kunnskap, 
            eksperimenterer med nye oppskrifter og skaper fantastiske øl sammen.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center bg-brew-card border border-brew-border rounded-lg p-8">
            <Users className="text-brew-amber text-4xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">12+</h3>
            <p className="text-brew-text-muted">Aktive medlemmer</p>
          </div>
          
          <div className="text-center bg-brew-card border border-brew-border rounded-lg p-8">
            <Beer className="text-brew-amber text-4xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">150+</h3>
            <p className="text-brew-text-muted">Brygget denne måneden</p>
          </div>
          
          <div className="text-center bg-brew-card border border-brew-border rounded-lg p-8">
            <Trophy className="text-brew-amber text-4xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">5</h3>
            <p className="text-brew-text-muted">Konkurranser vunnet</p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-headline font-bold mb-6 text-brew-text">
              Vår misjon
            </h2>
            <p className="text-brew-text-muted mb-6 leading-relaxed">
              Prefab Brew Crew ble grunnlagt i 2019 med en enkel visjon: å skape et fellesskap 
              hvor hjemmebrygger kan utvikle sine ferdigheter, dele kunnskap og produsere 
              eksepsjonell øl sammen.
            </p>
            <p className="text-brew-text-muted leading-relaxed">
              Vi tror at de beste ølene kommer fra deling av erfaring, eksperimentering 
              og kontinuerlig læring. Vårt fellesskap støtter både nybegynnere og 
              erfarne bryggere på deres reise.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Heart className="text-brew-amber text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Lidenskapsfullt fellesskap</h3>
                <p className="text-brew-text-muted">
                  Vi deler en genuin kjærlighet for bryggeekunsten og støtter hverandre.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Target className="text-brew-amber text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Kvalitetsfokus</h3>
                <p className="text-brew-text-muted">
                  Vi streber alltid etter å forbedre våre teknikker og øl-kvalitet.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Zap className="text-brew-amber text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Innovasjon</h3>
                <p className="text-brew-text-muted">
                  Vi eksperimenterer med nye ingredienser og bryggemetoder.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="bg-brew-card border border-brew-border rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-headline font-bold mb-8 text-center">
            Hva vi gjør
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-brew-amber/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Beer className="text-brew-amber text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ukentlige brygg</h3>
              <p className="text-brew-text-muted">
                Vi møtes hver uke for å brygge sammen og dele erfaringer.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-brew-amber/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="text-brew-amber text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Workshops</h3>
              <p className="text-brew-text-muted">
                Lærer nye teknikker og metoder fra erfarne bryggere.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-brew-amber/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-brew-amber text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Konkurranser</h3>
              <p className="text-brew-text-muted">
                Deltar i lokale og nasjonale hjemmebrygger-konkurranser.
              </p>
            </div>
          </div>
        </div>

        {/* Join Us Section */}
        <div className="text-center bg-gradient-to-r from-brew-amber/10 to-brew-amber/5 border border-brew-amber/20 rounded-lg p-12">
          <h2 className="text-3xl font-headline font-bold mb-6">
            Bli med i fellesskapet
          </h2>
          <p className="text-xl text-brew-text-muted mb-8 max-w-2xl mx-auto">
            Er du interessert i hjemmebrygging? Vi ønsker nye medlemmer velkommen! 
            Uansett om du er nybegynner eller erfaren, har vi plass til deg.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:kontakt@prefabbrewcrew.no" 
              className="bg-brew-amber text-brew-dark px-8 py-3 rounded-lg font-bold hover:bg-brew-amber/90 transition-colors"
            >
              Send oss e-post
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