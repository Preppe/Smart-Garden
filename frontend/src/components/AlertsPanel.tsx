import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

interface Alert {
  id: number;
  type: 'warning' | 'info' | 'success';
  message: string;
  time: string;
  zone: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanel = ({ alerts }: AlertsPanelProps) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-gray-100">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Bell className="w-5 h-5 mr-2 text-gray-600" />
            Recent Alerts
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {alerts.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)} relative group`}>
            <div className="flex items-start space-x-2">
              {getAlertIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{alert.message}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs opacity-75">{alert.zone}</p>
                  <p className="text-xs opacity-75">{alert.time}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0">
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent alerts</p>
          </div>
        )}

        <Button variant="outline" size="sm" className="w-full mt-3">
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
