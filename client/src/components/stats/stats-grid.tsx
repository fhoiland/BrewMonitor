import { Card, CardContent } from "@/components/ui/card";

interface Stats {
  totalBatches: number;
  litersProduced: number;
  activeFermenters: number;
  daysSinceLastBatch: number;
}

interface StatsGridProps {
  stats: Stats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const statItems = [
    {
      label: "Totale brygg",
      value: stats.totalBatches,
    },
    {
      label: "Liter produsert",
      value: `${stats.litersProduced}L`,
    },
    {
      label: "Aktive gjærtanker",
      value: stats.activeFermenters,
    },
    {
      label: "Dager siden siste brygg",
      value: stats.daysSinceLastBatch,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <Card key={index} className="bg-brew-card border-brew-border">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-brew-amber mb-2">
              {item.value}
            </div>
            <div className="text-sm text-brew-text-muted">
              {item.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
