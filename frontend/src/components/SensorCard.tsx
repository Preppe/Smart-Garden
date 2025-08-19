import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Edit, Eye, Activity, AlertTriangle, CheckCircle, Clock, Thermometer, Droplets, Sun, TestTube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GetUserSensorsQuery } from '@/graphql/generated/types';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

type Sensor = GetUserSensorsQuery['getUserSensors'][0];

interface SensorCardProps {
  sensor: Sensor;
  onDelete?: (id: string) => void;
}

const getSensorIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'temperature':
      return <Thermometer className="h-4 w-4" />;
    case 'humidity':
      return <Droplets className="h-4 w-4" />;
    case 'light':
      return <Sun className="h-4 w-4" />;
    case 'soil_moisture':
      return <Droplets className="h-4 w-4" />;
    case 'ph':
      return <TestTube className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getSensorTypeLabel = (type: string) => {
  switch (type.toLowerCase()) {
    case 'temperature':
      return 'Temperatura';
    case 'humidity':
      return 'Umidità';
    case 'light':
      return 'Luce';
    case 'soil_moisture':
      return 'Umidità Suolo';
    case 'ph':
      return 'pH';
    case 'air_quality':
      return 'Qualità Aria';
    default:
      return type;
  }
};

const getConnectionStatus = (lastDataReceived?: string | null) => {
  if (!lastDataReceived) {
    return { 
      status: 'disconnected', 
      label: 'Disconnesso', 
      color: 'bg-red-500',
      icon: <AlertTriangle className="h-3 w-3" />
    };
  }

  const lastReceived = new Date(lastDataReceived);
  const now = new Date();
  const diffMinutes = (now.getTime() - lastReceived.getTime()) / (1000 * 60);

  if (diffMinutes <= 5) {
    return { 
      status: 'connected', 
      label: 'Connesso', 
      color: 'bg-green-500',
      icon: <CheckCircle className="h-3 w-3" />
    };
  } else if (diffMinutes <= 30) {
    return { 
      status: 'warning', 
      label: 'Instabile', 
      color: 'bg-yellow-500',
      icon: <Clock className="h-3 w-3" />
    };
  } else {
    return { 
      status: 'disconnected', 
      label: 'Disconnesso', 
      color: 'bg-red-500',
      icon: <AlertTriangle className="h-3 w-3" />
    };
  }
};

const SensorCard: React.FC<SensorCardProps> = ({ 
  sensor, 
  onDelete
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const connectionStatus = getConnectionStatus(sensor.lastDataReceived);
  const sensorIcon = getSensorIcon(sensor.type);
  const typeLabel = getSensorTypeLabel(sensor.type);


  const handleDelete = async () => {
    if (onDelete) {
      setIsLoading(true);
      try {
        await onDelete(sensor.id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getLocationInfo = () => {
    if (sensor.garden) {
      return `${sensor.garden.name}${sensor.cultivation ? ` → ${sensor.cultivation.plantName}` : ''}`;
    }
    return 'Non assegnato';
  };

  return (
    <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg text-emerald-800 flex items-center gap-2">
              {sensorIcon}
              {sensor.name}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {typeLabel}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${connectionStatus.color}`} />
            <span className="text-xs text-muted-foreground">
              {connectionStatus.label}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            <strong>Posizione:</strong> {getLocationInfo()}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Device ID:</strong> {sensor.deviceId}
          </div>
          {sensor.lastDataReceived && (
            <div className="text-sm text-gray-600">
              <strong>Ultimo aggiornamento:</strong>{' '}
              {formatDistanceToNow(new Date(sensor.lastDataReceived), { 
                addSuffix: true, 
                locale: it 
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Badge variant={sensor.isActive ? "default" : "secondary"}>
              {sensor.isActive ? "Attivo" : "Inattivo"}
            </Badge>
            {sensor.locationLevel && (
              <Badge variant="outline" className="text-xs">
                {sensor.locationLevel === 'garden' ? 'Giardino' : 'Coltivazione'}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex space-x-2 pt-1">
          <Link to={`/sensors/${sensor.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-blue-600 hover:bg-blue-50 hover:border-blue-300">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>

          <Link to={`/sensors/${sensor.id}/edit`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-green-600 hover:bg-green-50 hover:border-green-300">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading} className="text-red-600 hover:bg-red-50 hover:border-red-300">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Elimina Sensore</AlertDialogTitle>
                <AlertDialogDescription>
                  Sei sicuro di voler eliminare il sensore "{sensor.name}"? 
                  Questa azione non può essere annullata e tutti i dati storici 
                  del sensore verranno persi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Elimina
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorCard;