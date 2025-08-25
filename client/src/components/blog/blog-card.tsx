import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { getBlogImage } from "@/assets/blog-images";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  createdAt: Date | string;
}

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("nb-NO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="bg-brew-card border-brew-border overflow-hidden hover:shadow-xl transition-shadow">
      {getBlogImage(post.imageUrl) && (
        <img 
          src={getBlogImage(post.imageUrl)!} 
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-6">
        <h3 className="text-xl font-headline font-semibold text-brew-text mb-2">
          {post.title}
        </h3>
        <p className="text-brew-text-muted text-sm mb-4">
          {post.summary}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-brew-text-muted">
            {formatDate(post.createdAt)}
          </span>
          <Link href={`/blog/${post.id}`}>
            <a className="text-brew-amber hover:text-brew-amber-light transition-colors font-medium text-sm flex items-center">
              Les mer <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
