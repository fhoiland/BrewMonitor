import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import Navigation from "@/components/layout/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Settings, Users } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brew-dark flex items-center justify-center">
        <div className="text-brew-amber">Laster...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/admin/login");
    return null;
  }

  const adminActions = [
    {
      title: "Bloggadministrasjon",
      description: "Administrer blogginnlegg, opprett nye artikler",
      icon: FileText,
      href: "/admin/blog",
      color: "text-brew-amber",
    },
    {
      title: "Bryggedata",
      description: "Oppdater bryggeinformasjon og fermenterdata",
      icon: BarChart3,
      href: "#",
      color: "text-brew-green",
    },
    {
      title: "Statistikk",
      description: "Se detaljert statistikk og analyser",
      icon: Users,
      href: "#",
      color: "text-blue-400",
    },
    {
      title: "Innstillinger",
      description: "Systeminnstillinger og konfigurasjon",
      icon: Settings,
      href: "#",
      color: "text-gray-400",
    },
  ];

  return (
    <div className="min-h-screen bg-brew-dark">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-bold text-brew-text mb-2">
            Admin Dashboard
          </h1>
          <p className="text-brew-text-muted">
            Administrer bryggeriet og innhold
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminActions.map((action, index) => (
            <Card key={index} className="bg-brew-card border-brew-border hover:border-brew-amber transition-colors">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                  <span className="text-brew-text font-headline text-lg">
                    {action.title}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-brew-text-muted text-sm mb-4">
                  {action.description}
                </p>
                <Link href={action.href}>
                  <Button 
                    className="w-full bg-brew-amber hover:bg-brew-amber-light text-brew-dark"
                    disabled={action.href === "#"}
                  >
                    {action.href === "#" ? "Kommer snart" : "Åpne"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Card className="bg-brew-card border-brew-border">
            <CardHeader>
              <CardTitle className="text-brew-text font-headline">
                Rask tilgang
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/blog">
                  <Button variant="outline" className="w-full border-brew-border text-brew-text hover:bg-brew-amber hover:text-brew-dark">
                    Nytt blogginnlegg
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full border-brew-border text-brew-text hover:bg-brew-amber hover:text-brew-dark">
                    Se nettside
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline" className="w-full border-brew-border text-brew-text hover:bg-brew-amber hover:text-brew-dark">
                    Se blogg
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
