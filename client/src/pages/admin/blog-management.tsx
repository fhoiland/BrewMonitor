import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/layout/navigation";
import BlogForm from "@/components/blog/blog-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogManagement() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog-posts"],
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/blog-posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({ title: "Blogginnlegg slettet!" });
    },
    onError: () => {
      toast({ title: "Feil ved sletting av blogginnlegg", variant: "destructive" });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brew-dark flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brew-amber" />
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/admin/login");
    return null;
  }

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Er du sikker på at du vil slette dette blogginnlegget?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedPost(null);
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("nb-NO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-brew-dark">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin">
              <Button variant="ghost" className="text-brew-amber hover:text-brew-amber-light mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tilbake til dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-headline font-bold text-brew-text mb-2">
              Bloggadministrasjon
            </h1>
            <p className="text-brew-text-muted">
              Administrer blogginnlegg og opprett nytt innhold
            </p>
          </div>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-brew-amber hover:bg-brew-amber-light text-brew-dark"
                onClick={() => setSelectedPost(null)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nytt innlegg
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-brew-card border-brew-border">
              <DialogHeader>
                <DialogTitle className="text-brew-text font-headline">
                  {selectedPost ? "Rediger blogginnlegg" : "Nytt blogginnlegg"}
                </DialogTitle>
              </DialogHeader>
              <BlogForm 
                initialData={selectedPost ? {
                  title: selectedPost.title,
                  summary: selectedPost.summary,
                  content: selectedPost.content,
                  imageUrl: selectedPost.imageUrl,
                  published: selectedPost.published,
                } : undefined}
                postId={selectedPost?.id}
                onSuccess={handleFormSuccess}
              />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-brew-amber" />
          </div>
        ) : (
          <Card className="bg-brew-card border-brew-border">
            <CardHeader>
              <CardTitle className="text-brew-text font-headline">
                Alle blogginnlegg
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blogPosts?.map((post) => (
                  <div 
                    key={post.id}
                    className="flex items-center justify-between p-4 border border-brew-border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-brew-text">
                          {post.title}
                        </h3>
                        <Badge 
                          variant={post.published ? "default" : "secondary"}
                          className={post.published ? "bg-brew-green" : "bg-gray-500"}
                        >
                          {post.published ? "Publisert" : "Utkast"}
                        </Badge>
                      </div>
                      <p className="text-brew-text-muted text-sm mb-2">
                        {post.summary}
                      </p>
                      <p className="text-xs text-brew-text-muted">
                        Opprettet: {formatDate(post.createdAt)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {post.published && (
                        <Link href={`/blog/${post.id}`}>
                          <Button variant="outline" size="sm" className="border-brew-border text-brew-text hover:bg-brew-amber hover:text-brew-dark">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(post)}
                        className="border-brew-border text-brew-text hover:bg-brew-amber hover:text-brew-dark"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        disabled={deleteMutation.isPending}
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
                
                {!blogPosts || blogPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-brew-text-muted">
                      Ingen blogginnlegg funnet. Opprett ditt første innlegg!
                    </p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
