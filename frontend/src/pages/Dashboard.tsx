import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Thermometer, Droplets, Sun, Leaf, Sprout, Eye } from 'lucide-react';

import GardenZoneCard from '@/components/GardenZoneCard';
import SensorChart from '@/components/SensorChart';
import WeatherWidget from '@/components/WeatherWidget';
import AlertsPanel from '@/components/AlertsPanel';

const Dashboard = () => {
  const [autoWatering, setAutoWatering] = useState(true);
  const [autoLighting, setAutoLighting] = useState(false);
  const [currentTemp, setCurrentTemp] = useState(24);
  const [humidity, setHumidity] = useState(68);
  const [soilMoisture, setSoilMoisture] = useState(45);

  // Simulate real-time sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemp((prev) => prev + (Math.random() - 0.5) * 2);
      setHumidity((prev) => Math.max(30, Math.min(90, prev + (Math.random() - 0.5) * 5)));
      setSoilMoisture((prev) => Math.max(20, Math.min(80, prev + (Math.random() - 0.5) * 3)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const gardenZones = [
    {
      id: 1,
      name: 'Herb Garden',
      plants: ['Basil', 'Rosemary', 'Thyme'],
      health: 92,
      status: 'excellent' as const,
      lastWatered: '2 hours ago',
      nextWatering: 'in 4 hours',
    },
    {
      id: 2,
      name: 'Tomato Patch',
      plants: ['Cherry Tomatoes', 'Beefsteak'],
      health: 78,
      status: 'good' as const,
      lastWatered: '6 hours ago',
      nextWatering: 'in 2 hours',
    },
    {
      id: 3,
      name: 'Lettuce Bed',
      plants: ['Romaine', 'Arugula', 'Spinach'],
      health: 65,
      status: 'needs-attention' as const,
      lastWatered: '8 hours ago',
      nextWatering: 'overdue',
    },
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning' as const,
      message: 'Lettuce bed soil moisture below optimal range',
      time: '10 minutes ago',
      zone: 'Lettuce Bed',
    },
    {
      id: 2,
      type: 'info' as const,
      message: 'Herb garden automated watering completed',
      time: '2 hours ago',
      zone: 'Herb Garden',
    },
    {
      id: 3,
      type: 'success' as const,
      message: 'All sensors online and functioning',
      time: '1 day ago',
      zone: 'System',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/60 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{currentTemp.toFixed(1)}°C</div>
            <p className="text-xs text-gray-500 mt-1">Optimal range: 18-26°C</p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-cyan-100 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Humidity</CardTitle>
            <Droplets className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{humidity.toFixed(0)}%</div>
            <Progress value={humidity} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-amber-100 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Soil Moisture</CardTitle>
            <Sprout className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{soilMoisture.toFixed(0)}%</div>
            <Progress value={soilMoisture} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-yellow-100 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Light Level</CardTitle>
            <Sun className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">8,500 lux</div>
            <p className="text-xs text-gray-500 mt-1">Direct sunlight</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Garden Zones */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Garden Zones</h2>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {gardenZones.map((zone) => (
              <GardenZoneCard key={zone.id} zone={zone} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Weather */}
          <WeatherWidget />

          {/* Automation Controls */}
          <Card className="bg-white/60 backdrop-blur-sm border-green-100">
            <CardHeader>
              <CardTitle className="text-lg">Automation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Auto Watering</span>
                </div>
                <Switch checked={autoWatering} onCheckedChange={setAutoWatering} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Auto Lighting</span>
                </div>
                <Switch checked={autoLighting} onCheckedChange={setAutoLighting} />
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <AlertsPanel alerts={alerts} />
        </div>
      </div>

      {/* Sensor Data Chart */}
      <Card className="bg-white/60 backdrop-blur-sm border-gray-100">
        <CardHeader>
          <CardTitle className="text-lg">Sensor Data Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <SensorChart />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
