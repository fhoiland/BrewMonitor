import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Beer, Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Brukernavn er påkrevd"),
  password: z.string().min(1, "Passord er påkrevd"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Use useEffect for redirect to avoid render-time state updates
  React.useEffect(() => {
    if (isAuthenticated) {
      setLocation("/admin");
    }
  }, [isAuthenticated, setLocation]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password);
      toast({ title: "Innlogget!" });
      setLocation("/admin");
    } catch (error) {
      toast({ 
        title: "Innlogging feilet", 
        description: "Ugyldig brukernavn eller passord",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brew-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Beer className="text-brew-amber text-3xl" />
            <span className="text-2xl font-headline font-bold text-brew-text">
              Prefab Brew Crew
            </span>
          </div>
          <h1 className="text-xl font-headline text-brew-text">
            Admin Innlogging
          </h1>
        </div>

        <Card className="bg-brew-card border-brew-border">
          <CardHeader>
            <CardTitle className="text-brew-text text-center">
              Logg inn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brew-text">Brukernavn</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-brew-dark border-brew-border text-brew-text"
                          placeholder="Skriv inn brukernavn"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brew-text">Passord</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password"
                          className="bg-brew-dark border-brew-border text-brew-text"
                          placeholder="Skriv inn passord"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-brew-amber hover:bg-brew-amber-light text-brew-dark"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Logg inn
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
