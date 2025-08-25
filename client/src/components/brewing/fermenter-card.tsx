import { Card, CardContent } from "@/components/ui/card";
import { FlaskConical, Beer, Thermometer, Droplets, Beaker, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useBrewingLabels } from "@shared/brewing-config";

interface FermenterData {
  fermenterBeerType: string;
  fermenterTemperature: number;
  fermenterGravity: number;
  fermenterTotal: string;
  fermenterTimeRemaining: string;
  fermenterProgress: number;
}

interface FermenterCardProps {
  data: FermenterData;
}

export default function FermenterCard({ data }: FermenterCardProps) {
  const labels = useBrewingLabels();
  
  return (
    <Card className="bg-brew-card border-brew-border">
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <FlaskConical className="text-brew-amber text-2xl mr-3" />
          <h2 className="text-2xl font-headline font-bold text-brew-text">
            {labels.fermenter.title}
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Beer className="text-brew-amber mr-2 h-4 w-4" />
              <span className="text-brew-text-muted">{labels.fermenter.beerType}</span>
            </div>
            <span className="text-2xl font-headline font-bold text-brew-text">
              {data.fermenterBeerType}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Thermometer className="text-brew-amber mr-2 h-4 w-4" />
              <span className="text-brew-text-muted">{labels.fermenter.temperature}</span>
            </div>
            <span className="text-xl font-mono text-brew-text">
              {data.fermenterTemperature}°C
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Droplets className="text-brew-amber mr-2 h-4 w-4" />
              <span className="text-brew-text-muted">{labels.fermenter.gravity}</span>
            </div>
            <span className="text-xl font-mono text-brew-text">
              {data.fermenterGravity}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Beaker className="text-brew-amber mr-2 h-4 w-4" />
              <span className="text-brew-text-muted">{labels.fermenter.total}</span>
            </div>
            <span className="text-xl font-mono text-brew-text">
              {data.fermenterTotal}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="text-brew-amber mr-2 h-4 w-4" />
                <span className="text-brew-text-muted">{labels.fermenter.timeRemaining}</span>
              </div>
              <span className="text-sm text-brew-text">
                {data.fermenterTimeRemaining}
              </span>
            </div>
            <Progress 
              value={data.fermenterProgress} 
              className="h-2 bg-brew-border"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
