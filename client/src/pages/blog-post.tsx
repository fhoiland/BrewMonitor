import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { getBlogImage } from "@/assets/blog-images";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:id");
  const postId = params?.id;

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog-posts", postId],
    enabled: !!postId,
  });

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("nb-NO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-brew-dark">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="text-brew-amber hover:text-brew-amber-light">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tilbake til blogg
            </Button>
          </Link>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-brew-amber" />
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <h1 className="text-2xl font-headline font-bold text-brew-text mb-4">
              Blogginnlegg ikke funnet
            </h1>
            <p className="text-brew-text-muted">
              Innlegget du leter etter eksisterer ikke eller er ikke publisert.
            </p>
          </div>
        )}

        {post && (
          <article className="max-w-4xl mx-auto">
            {getBlogImage(post.imageUrl) && (
              <img 
                src={getBlogImage(post.imageUrl)!} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
              />
            )}
            
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-brew-text mb-4">
                {post.title}
              </h1>
              
              <div className="flex items-center text-brew-text-muted mb-6">
                <Calendar className="h-4 w-4 mr-2" />
                <time dateTime={post.createdAt}>
                  {formatDate(post.createdAt)}
                </time>
              </div>
              
              <p className="text-xl text-brew-text-muted leading-relaxed">
                {post.summary}
              </p>
            </div>

            <div className="prose prose-lg prose-invert max-w-none">
              <div className="text-brew-text whitespace-pre-wrap leading-relaxed">
                {post.content}
              </div>
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
