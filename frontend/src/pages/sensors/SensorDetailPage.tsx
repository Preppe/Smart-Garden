import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, Trash2, Activity, Wifi, BarChart3, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { BackButton } from '@/components/ui/back-button';
import { ActionButtons } from '@/components/ui/action-buttons';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import SensorDataChart from '@/components/SensorDataChart';
import MqttConnectionInfo from '@/components/MqttConnectionInfo';
import { 
  useGetSensorQuery,
  useGetMqttConnectionInfoQuery,
  useGetSensorDataQuery,
  useGetLatestSensorValueQuery,
  useDeleteSensorMutation,
  SensorDataQueryInput
} from '@/graphql/generated/types';

const SensorDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [timeRange, setTimeRange] = useState('24h');
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // GraphQL queries
  const { data: sensorData, loading: sensorLoading, error: sensorError, refetch: refetchSensor } = useGetSensorQuery({
    variables: { id: id! },
    skip: !id,
  });

  const { data: connectionData, loading: connectionLoading } = useGetMqttConnectionInfoQuery({
    variables: { sensorId: id! },
    skip: !id,
  });

  const { data: latestData, loading: latestLoading, refetch: refetchLatest } = useGetLatestSensorValueQuery({
    variables: { sensorId: id! },
    skip: !id,
  });

  // Build query for historical data - memoized to prevent infinite loops
  const [queryTimestamp, setQueryTimestamp] = useState(() => new Date());
  
  const dataQuery = useMemo((): SensorDataQueryInput => {
    let start: Date;
    let aggregateWindow: string | undefined;

    switch (timeRange) {
      case '1h':
        start = new Date(queryTimestamp.getTime() - 60 * 60 * 1000);
        break;
      case '6h':
        start = new Date(queryTimestamp.getTime() - 6 * 60 * 60 * 1000);
        aggregateWindow = '5m';
        break;
      case '24h':
        start = new Date(queryTimestamp.getTime() - 24 * 60 * 60 * 1000);
        aggregateWindow = '15m';
        break;
      case '7d':
        start = new Date(queryTimestamp.getTime() - 7 * 24 * 60 * 60 * 1000);
        aggregateWindow = '1h';
        break;
      case '30d':
        start = new Date(queryTimestamp.getTime() - 30 * 24 * 60 * 60 * 1000);
        aggregateWindow = '6h';
        break;
      default:
        start = new Date(queryTimestamp.getTime() - 24 * 60 * 60 * 1000);
        aggregateWindow = '15m';
    }

    return {
      start: start.toISOString(),
      stop: queryTimestamp.toISOString(),
      aggregateWindow,
    };
  }, [timeRange, queryTimestamp]);

  const { data: chartData, loading: chartLoading, refetch: refetchChart } = useGetSensorDataQuery({
    variables: { 
      sensorId: id!, 
      query: dataQuery
    },
    skip: !id,
  });

  // Mutations
  const [deleteSensor, { loading: deleteLoading }] = useDeleteSensorMutation();

  const sensor = sensorData?.getSensor;
  const connectionInfo = connectionData?.getMqttConnectionInfo;
  const sensorChartData = chartData?.getSensorData || [];
  const latestValue = latestData?.getLatestSensorValue;

  // Set up polling for real-time updates
  useEffect(() => {
    if (sensor && sensor.isActive) {
      const interval = setInterval(() => {
        refetchLatest();
      }, 30000); // Poll every 30 seconds

      setPollingInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [sensor, refetchLatest]);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const handleTimeRangeChange = (newRange: string) => {
    setTimeRange(newRange);
    setQueryTimestamp(new Date()); // Update timestamp to refetch data
  };

  const handleDeleteSensor = async () => {
    if (!id) return;

    try {
      await deleteSensor({
        variables: { id },
        refetchQueries: ['GetUserSensors'],
      });

      toast({
        title: "Sensore eliminato",
        description: "Il sensore è stato eliminato con successo",
      });

      navigate('/sensors');
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Impossibile eliminare il sensore",
        variant: "destructive",
      });
    }
  };


  const getConnectionStatus = () => {
    if (!sensor?.lastDataReceived) {
      return { status: 'disconnected', label: 'Disconnesso', color: 'bg-red-500' };
    }

    const lastReceived = new Date(sensor.lastDataReceived);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastReceived.getTime()) / (1000 * 60);

    if (diffMinutes <= 5) {
      return { status: 'connected', label: 'Connesso', color: 'bg-green-500' };
    } else if (diffMinutes <= 30) {
      return { status: 'warning', label: 'Instabile', color: 'bg-yellow-500' };
    } else {
      return { status: 'disconnected', label: 'Disconnesso', color: 'bg-red-500' };
    }
  };

  // Loading state
  if (sensorLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (sensorError || !sensor) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <BackButton onClick={() => navigate('/sensors')}>Torna ai Sensori</BackButton>
          <div></div>
        </div>

        <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {sensorError ? 'Errore nel caricamento' : 'Sensore non trovato'}
            </h3>
            <p className="text-gray-600 mb-4">
              {sensorError 
                ? 'Impossibile caricare i dati del sensore'
                : 'Il sensore che stai cercando non esiste o non hai i permessi per accedervi'
            }
            </p>
            <div className="space-x-2">
              {sensorError && (
                <Button variant="outline" onClick={() => refetchSensor()}>
                  Riprova
                </Button>
              )}
              <Button onClick={() => navigate('/sensors')}>
                Torna ai Sensori
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const connectionStatus = getConnectionStatus();

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <BackButton onClick={() => navigate('/sensors')}>Torna ai Sensori</BackButton>
        <ActionButtons
          editAction={() => navigate(`/sensors/${sensor.id}/edit`)}
          deleteAction={handleDeleteSensor}
          deleteConfirmation={{
            title: "Sei sicuro?",
            description: `Questa azione eliminerà permanentemente il sensore "${sensor.name}" e tutti i suoi dati storici. Questa operazione non può essere annullata.`
          }}
          isDeleting={deleteLoading}
          additionalActions={
            <Button variant="outline" onClick={() => {
              refetchSensor();
              refetchLatest();
              setQueryTimestamp(new Date()); // This will trigger chart data refetch
            }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Aggiorna
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sensor Info */}
          <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <Activity className="w-5 h-5" />
                  <span>{sensor.name}</span>
                  <div className={`w-3 h-3 rounded-full ${connectionStatus.color}`} />
                </CardTitle>
                <Badge variant={sensor.isActive ? "default" : "secondary"}>
                  {sensor.isActive ? "Attivo" : "Inattivo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ultimo Valore</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {latestValue ? `${latestValue.value} ${sensor.unit}` : 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Stato Connessione</p>
                  <p className="font-medium">{connectionStatus.label}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <strong>Device ID:</strong> {sensor.deviceId}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Tipo:</strong> {sensor.type}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Ultimo Aggiornamento:</strong> {' '}
                  {sensor.lastDataReceived 
                    ? formatDistanceToNow(new Date(sensor.lastDataReceived), { 
                        addSuffix: true, 
                        locale: it 
                      })
                    : 'Mai'
                  }
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Unità:</strong> {sensor.unit}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Chart */}
          <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Dati Storici
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SensorDataChart
                data={sensorChartData}
                sensorName={sensor.name}
                sensorType={sensor.type}
                unit={sensor.unit}
                thresholds={sensor.thresholds || undefined}
                isLoading={chartLoading}
                onTimeRangeChange={handleTimeRangeChange}
              />
            </CardContent>
          </Card>

          {/* Connection Info */}
          <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-green-600" />
                Connessione MQTT
              </CardTitle>
            </CardHeader>
            <CardContent>
              {connectionInfo ? (
                <MqttConnectionInfo
                  connectionInfo={connectionInfo}
                  sensorName={sensor.name}
                />
              ) : connectionLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Caricamento informazioni connessione...</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Impossibile caricare le informazioni di connessione</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Location Info */}
          {(sensor.garden || sensor.cultivation) && (
            <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Posizione
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sensor.garden && (
                    <div>
                      <p className="font-medium text-gray-900">{sensor.garden.name}</p>
                      <p className="text-sm text-gray-600">Giardino</p>
                    </div>
                  )}
                  {sensor.cultivation && (
                    <div>
                      <p className="font-medium text-gray-900">{sensor.cultivation.plantName}</p>
                      <p className="text-sm text-gray-600">Coltivazione</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}


          {/* Configuration */}
          <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Configurazione
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-sm text-gray-600">ID</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded block break-all">{sensor.id}</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Creato</span>
                  <span className="text-sm font-medium">{new Date(sensor.createdAt).toLocaleDateString('it-IT')}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-gray-600">Topic MQTT</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded block break-all">{sensor.mqttTopic}</code>
                </div>
              </div>

              {/* Calibration */}
              {sensor.calibration && (
                <div className="pt-3 border-t border-gray-100">
                  <h4 className="font-medium mb-2 text-gray-900">Calibrazione</h4>
                  <div className="space-y-2">
                    {sensor.calibration.offset !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Offset</span>
                        <span className="text-sm font-medium">{sensor.calibration.offset}</span>
                      </div>
                    )}
                    {sensor.calibration.multiplier !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Moltiplicatore</span>
                        <span className="text-sm font-medium">{sensor.calibration.multiplier}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Thresholds */}
              {sensor.thresholds && (
                <div className="pt-3 border-t border-gray-100">
                  <h4 className="font-medium mb-2 text-gray-900">Soglie</h4>
                  <div className="space-y-2">
                    {sensor.thresholds.min !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Minimo</span>
                        <span className="text-sm font-medium">{sensor.thresholds.min} {sensor.unit}</span>
                      </div>
                    )}
                    {sensor.thresholds.optimal_min !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ottimale Min</span>
                        <span className="text-sm font-medium">{sensor.thresholds.optimal_min} {sensor.unit}</span>
                      </div>
                    )}
                    {sensor.thresholds.optimal_max !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ottimale Max</span>
                        <span className="text-sm font-medium">{sensor.thresholds.optimal_max} {sensor.unit}</span>
                      </div>
                    )}
                    {sensor.thresholds.max !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Massimo</span>
                        <span className="text-sm font-medium">{sensor.thresholds.max} {sensor.unit}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SensorDetailPage;