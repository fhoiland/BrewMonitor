import { Card, CardContent } from "@/components/ui/card";
import { Flame, Thermometer, Cog, Zap, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useBrewingLabels } from "@shared/brewing-config";

interface BrewKettleData {
  kettleTemperature: number;
  maltTemperature: number;
  mode: string;
  power: number;
  timeGMT: string;
}

interface BrewKettleCardProps {
  data: BrewKettleData;
}

export default function BrewKettleCard({ data }: BrewKettleCardProps) {
  const labels = useBrewingLabels();
  
  return (
    <Card className="bg-brew-card border-brew-border">
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <Flame className="text-brew-red text-2xl mr-3" />
          <h2 className="text-2xl font-headline font-bold text-brew-text">
            {labels.brewKettle.title}
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Thermometer className="text-brew-amber mr-2 h-4 w-4" />
              <span className="text-brew-text-muted">{labels.brewKettle.temperature}</span>
            </div>
            <span className="text-2xl font-mono font-bold text-brew-text">
              {data.kettleTemperature}°C
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Thermometer className="text-brew-amber mr-2 h-4 w-4" />
              <span className="text-brew-text-muted">{labels.brewKettle.maltTemperature}</span>
            </div>
            <span className="text-xl font-mono text-brew-text">
              {data.maltTemperature}°C
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Cog className="text-brew-amber mr-2 h-4 w-4" />
              <span className="text-brew-text-muted">{labels.brewKettle.mode}</span>
            </div>
            <Badge 
              className={`${
                data.mode === "Boil" 
                  ? "bg-brew-red text-white" 
                  : "bg-brew-green text-white"
              }`}
            >
              {data.mode}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Zap className="text-brew-amber mr-2 h-4 w-4" />
              <span className="text-brew-text-muted">{labels.brewKettle.power}</span>
            </div>
            <span className="text-xl font-mono text-brew-text">
              {data.power}W
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Clock className="text-brew-amber mr-2 h-4 w-4" />
              <span className="text-brew-text-muted">{labels.brewKettle.timeGMT}</span>
            </div>
            <span className="text-xl font-mono text-brew-text">
              {data.timeGMT}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
