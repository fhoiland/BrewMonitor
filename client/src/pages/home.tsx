import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import BrewKettleCard from "@/components/brewing/brew-kettle-card";
import FermenterCard from "@/components/brewing/fermenter-card";
import BlogCard from "@/components/blog/blog-card";
import StatsGrid from "@/components/stats/stats-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  createdAt: string;
}

interface BrewingData {
  kettleTemperature: number;
  maltTemperature: number;
  mode: string;
  power: number;
  timeGMT: string;
  fermenterBeerType: string;
  fermenterTemperature: number;
  fermenterGravity: number;
  fermenterTotal: string;
  fermenterTimeRemaining: string;
  fermenterProgress: number;
}

interface Stats {
  totalBatches: number;
  litersProduced: number;
  activeFermenters: number;
  daysSinceLastBatch: number;
}

export default function Home() {
  const { data: brewingData, isLoading: brewingLoading } = useQuery<BrewingData>({
    queryKey: ["/api/brewing-data"],
  });

  const { data: blogPosts, isLoading: blogLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const isLoading = brewingLoading || blogLoading || statsLoading;

  return (
    <div className="min-h-screen bg-brew-dark">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Brewing Status Dashboard */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {isLoading ? (
              <>
                <div className="flex items-center justify-center h-64 bg-brew-card border border-brew-border rounded-xl">
                  <Loader2 className="h-8 w-8 animate-spin text-brew-amber" />
                </div>
                <div className="flex items-center justify-center h-64 bg-brew-card border border-brew-border rounded-xl">
                  <Loader2 className="h-8 w-8 animate-spin text-brew-amber" />
                </div>
              </>
            ) : (
              <>
                {brewingData && <BrewKettleCard data={brewingData} />}
                {brewingData && <FermenterCard data={brewingData} />}
              </>
            )}
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-headline font-bold text-brew-text mb-4">
              Fra Bryggerloggen
            </h2>
            <p className="text-brew-text-muted max-w-2xl mx-auto">
              Følg våre bryggeventyr og lær av våre erfaringer. Fra nye oppskrifter til tekniske tips - her deler vi alt fra bryggeriet.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {blogLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-center h-64 bg-brew-card border border-brew-border rounded-xl"
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-brew-amber" />
                  </div>
                ))}
              </>
            ) : (
              blogPosts?.slice(0, 3).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))
            )}
          </div>
          
          <div className="text-center">
            <Link href="/blog">
              <Button className="bg-brew-amber hover:bg-brew-amber-light text-brew-dark font-medium">
                Se alle innlegg
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-12">
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className="flex items-center justify-center h-24 bg-brew-card border border-brew-border rounded-xl"
                >
                  <Loader2 className="h-6 w-6 animate-spin text-brew-amber" />
                </div>
              ))}
            </div>
          ) : (
            stats && <StatsGrid stats={stats} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
