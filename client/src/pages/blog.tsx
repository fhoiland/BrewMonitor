import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import BlogCard from "@/components/blog/blog-card";
import { Loader2 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  createdAt: string;
}

export default function Blog() {
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  return (
    <div className="min-h-screen bg-brew-dark">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold text-brew-text mb-4">
            Bryggerloggen
          </h1>
          <p className="text-brew-text-muted max-w-2xl mx-auto">
            Utforsk våre erfaringer, tips og historier fra bryggeriet. Fra tekniske guider til bryggeoppdateringer - alt du trenger å vite om hjemmebryggeriet.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="flex items-center justify-center h-64 bg-brew-card border border-brew-border rounded-xl"
              >
                <Loader2 className="h-8 w-8 animate-spin text-brew-amber" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts?.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {!isLoading && (!blogPosts || blogPosts.length === 0) && (
          <div className="text-center py-16">
            <h3 className="text-xl font-headline text-brew-text mb-2">
              Ingen blogginnlegg funnet
            </h3>
            <p className="text-brew-text-muted">
              Kom tilbake senere for nytt innhold!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
