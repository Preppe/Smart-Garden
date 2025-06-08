import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Droplets, Clock, Leaf, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

interface GardenZone {
  id: number;
  name: string;
  plants: string[];
  health: number;
  status: 'excellent' | 'good' | 'needs-attention';
  lastWatered: string;
  nextWatering: string;
}

interface GardenZoneCardProps {
  zone: GardenZone;
}

const GardenZoneCard = ({ zone }: GardenZoneCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'good':
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case 'needs-attention':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'good':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'needs-attention':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 85) return 'text-green-600';
    if (health >= 70) return 'text-blue-600';
    return 'text-amber-600';
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-400">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{zone.name}</CardTitle>
          <Badge variant="outline" className={getStatusColor(zone.status)}>
            {getStatusIcon(zone.status)}
            <span className="ml-1 capitalize">{zone.status.replace('-', ' ')}</span>
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {zone.plants.map((plant, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
              <Leaf className="w-3 h-3 mr-1" />
              {plant}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Plant Health</span>
            <span className={`text-sm font-bold ${getHealthColor(zone.health)}`}>{zone.health}%</span>
          </div>
          <Progress value={zone.health} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center text-gray-600 mb-1">
              <Droplets className="w-3 h-3 mr-1" />
              Last Watered
            </div>
            <div className="font-medium">{zone.lastWatered}</div>
          </div>
          <div>
            <div className="flex items-center text-gray-600 mb-1">
              <Clock className="w-3 h-3 mr-1" />
              Next Watering
            </div>
            <div className={`font-medium ${zone.nextWatering === 'overdue' ? 'text-red-600' : 'text-gray-900'}`}>{zone.nextWatering}</div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            Water Now
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GardenZoneCard;
