import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudRain, Sun, Wind, Droplets } from 'lucide-react';

const WeatherWidget = () => {
  return (
    <Card className="bg-white/60 backdrop-blur-sm border-blue-100">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Sun className="w-5 h-5 mr-2 text-yellow-500" />
          Local Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">22°C</div>
            <div className="text-sm text-gray-600">Partly Cloudy</div>
          </div>
          <Sun className="w-8 h-8 text-yellow-500" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <Wind className="w-4 h-4 mr-2 text-gray-500" />
            <span>12 km/h</span>
          </div>
          <div className="flex items-center">
            <Droplets className="w-4 h-4 mr-2 text-blue-500" />
            <span>72%</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="text-sm text-gray-600 mb-2">Tomorrow</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CloudRain className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm">Light Rain</span>
            </div>
            <span className="text-sm font-medium">18°-24°</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
