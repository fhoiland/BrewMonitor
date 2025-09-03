import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

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
      {post.imageUrl && (
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            // Hide image if it fails to load
            e.currentTarget.style.display = 'none';
          }}
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
            <span className="text-brew-amber hover:text-brew-amber-light transition-colors font-medium text-sm flex items-center cursor-pointer">
              Les mer <ArrowRight className="ml-1 h-3 w-3" />
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
