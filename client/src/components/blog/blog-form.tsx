import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Loader2 } from "lucide-react";

const blogFormSchema = z.object({
  title: z.string().min(1, "Tittel er påkrevd"),
  summary: z.string().min(1, "Sammendrag er påkrevd"),
  content: z.string().min(1, "Innhold er påkrevd"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
});

type BlogFormData = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  initialData?: Partial<BlogFormData>;
  postId?: string;
  onSuccess?: () => void;
}

export default function BlogForm({ initialData, postId, onSuccess }: BlogFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      summary: initialData?.summary || "",
      content: initialData?.content || "",
      imageUrl: initialData?.imageUrl || "",
      published: initialData?.published || false,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: BlogFormData) => 
      apiRequest("POST", "/api/admin/blog-posts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({ title: "Blogginnlegg opprettet!" });
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "Feil ved oppretting av blogginnlegg", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: BlogFormData) => 
      apiRequest("PUT", `/api/admin/blog-posts/${postId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts", postId] });
      toast({ title: "Blogginnlegg oppdatert!" });
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "Feil ved oppdatering av blogginnlegg", variant: "destructive" });
    },
  });

  const generateMutation = useMutation({
    mutationFn: ({ topic, additionalContext }: { topic: string; additionalContext?: string }) =>
      apiRequest("POST", "/api/admin/generate-blog-post", { topic, additionalContext }),
    onSuccess: async (response) => {
      const data = await response.json();
      form.setValue("title", data.title);
      form.setValue("summary", data.summary);
      form.setValue("content", data.content);
      toast({ title: "AI-innhold generert!" });
    },
    onError: () => {
      toast({ title: "Feil ved generering av AI-innhold", variant: "destructive" });
    },
  });

  const onSubmit = (data: BlogFormData) => {
    if (postId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleGenerateContent = async () => {
    const topic = form.getValues("title");
    if (!topic.trim()) {
      toast({ title: "Skriv inn en tittel først", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      await generateMutation.mutateAsync({ topic });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-brew-card border-brew-border">
      <CardHeader>
        <CardTitle className="text-brew-text font-headline">
          {postId ? "Rediger blogginnlegg" : "Nytt blogginnlegg"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-brew-text">Tittel</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-brew-dark border-brew-border text-brew-text"
                        placeholder="Skriv inn tittel..."
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGenerateContent}
                      disabled={isGenerating || !field.value.trim()}
                      className="border-brew-amber text-brew-amber hover:bg-brew-amber hover:text-brew-dark"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-brew-text">Sammendrag</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="bg-brew-dark border-brew-border text-brew-text"
                      rows={3}
                      placeholder="Kort sammendrag av innlegget..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-brew-text">Innhold</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="bg-brew-dark border-brew-border text-brew-text"
                      rows={10}
                      placeholder="Hovedinnhold i innlegget..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-brew-text">Bilde URL (valgfritt)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-brew-dark border-brew-border text-brew-text"
                      placeholder="https://example.com/image.jpg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-brew-border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base text-brew-text">
                      Publiser innlegg
                    </FormLabel>
                    <div className="text-brew-text-muted text-sm">
                      Gjør innlegget synlig for besøkende
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-brew-amber hover:bg-brew-amber-light text-brew-dark"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {postId ? "Oppdater" : "Opprett"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
