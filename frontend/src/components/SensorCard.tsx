import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Eye, Activity, AlertTriangle, CheckCircle, Clock, Thermometer, Droplets, Sun, TestTube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GetUserSensorsQuery } from '@/graphql/generated/types';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

type Sensor = GetUserSensorsQuery['getUserSensors'][0];

interface SensorCardProps {
  sensor: Sensor;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (id: string) => void;
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
  onEdit, 
  onDelete, 
  onViewDetails 
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const connectionStatus = getConnectionStatus(sensor.lastDataReceived);
  const sensorIcon = getSensorIcon(sensor.type);
  const typeLabel = getSensorTypeLabel(sensor.type);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(sensor.id);
    } else {
      navigate(`/sensors/${sensor.id}`);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(sensor.id);
    } else {
      navigate(`/sensors/${sensor.id}/edit`);
    }
  };

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
          <Button variant="outline" size="sm" onClick={handleViewDetails} className="flex-1">
            <Eye className="mr-1 h-3 w-3" />
            Dettagli
          </Button>

          <Button variant="outline" size="sm" onClick={handleEdit} className="flex-1">
            <Edit className="mr-1 h-3 w-3" />
            Modifica
          </Button>

          <Button variant="outline" size="sm" onClick={handleDelete} disabled={isLoading} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorCard;