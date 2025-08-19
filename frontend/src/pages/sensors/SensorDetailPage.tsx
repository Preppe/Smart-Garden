import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Trash2, Activity, Wifi, BarChart3, Settings, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import SensorDataChart from '@/components/SensorDataChart';
import MqttConnectionInfo from '@/components/MqttConnectionInfo';
import SensorCommands from '@/components/SensorCommands';
import { 
  useGetSensorQuery,
  useGetMqttConnectionInfoQuery,
  useGetSensorDataQuery,
  useGetLatestSensorValueQuery,
  useDeleteSensorMutation,
  useSendSensorCommandMutation,
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

  // Build query for historical data
  const buildDataQuery = (range: string): SensorDataQueryInput => {
    const now = new Date();
    let start: Date;
    let aggregateWindow: string | undefined;

    switch (range) {
      case '1h':
        start = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '6h':
        start = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        aggregateWindow = '5m';
        break;
      case '24h':
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        aggregateWindow = '15m';
        break;
      case '7d':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        aggregateWindow = '1h';
        break;
      case '30d':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        aggregateWindow = '6h';
        break;
      default:
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        aggregateWindow = '15m';
    }

    return {
      start: start.toISOString(),
      stop: now.toISOString(),
      aggregateWindow,
    };
  };

  const { data: chartData, loading: chartLoading, refetch: refetchChart } = useGetSensorDataQuery({
    variables: { 
      sensorId: id!, 
      query: buildDataQuery(timeRange) 
    },
    skip: !id,
  });

  // Mutations
  const [deleteSensor, { loading: deleteLoading }] = useDeleteSensorMutation();
  const [sendCommand, { loading: commandLoading }] = useSendSensorCommandMutation();

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
    // The query will automatically refetch due to the reactive variables
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

  const handleSendCommand = async (command: string, parameters?: Record<string, any>) => {
    if (!id) return;

    await sendCommand({
      variables: {
        sensorId: id,
        input: { command, parameters },
      },
    });
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
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/sensors')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna ai Sensori
          </Button>
        </div>

        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-16 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (sensorError || !sensor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/sensors')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna ai Sensori
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {sensorError ? 'Errore nel caricamento' : 'Sensore non trovato'}
              </h3>
              <p className="text-muted-foreground mb-4">
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
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const connectionStatus = getConnectionStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/sensors')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna ai Sensori
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {sensor.name}
              <div className={`w-3 h-3 rounded-full ${connectionStatus.color}`} />
            </h1>
            <p className="text-muted-foreground">
              {sensor.type} • {sensor.deviceId} • {connectionStatus.label}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetchSensor()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Aggiorna
          </Button>
          <Button variant="outline" onClick={() => navigate(`/sensors/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Modifica
          </Button>
          <Button variant="outline" onClick={handleDeleteSensor} disabled={deleteLoading}>
            <Trash2 className="h-4 w-4 mr-2" />
            Elimina
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {latestValue ? `${latestValue.value} ${sensor.unit}` : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Ultimo Valore</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Badge variant={sensor.isActive ? "default" : "secondary"} className="mb-2">
                {sensor.isActive ? "Attivo" : "Inattivo"}
              </Badge>
              <div className="text-sm text-muted-foreground">Stato</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Badge variant="outline" className="mb-2">
                {sensor.locationLevel === 'garden' ? 'Giardino' : 'Coltivazione'}
              </Badge>
              <div className="text-sm text-muted-foreground">Posizione</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm font-medium">
                {sensor.lastDataReceived 
                  ? formatDistanceToNow(new Date(sensor.lastDataReceived), { 
                      addSuffix: true, 
                      locale: it 
                    })
                  : 'Mai'
                }
              </div>
              <div className="text-sm text-muted-foreground">Ultimo Aggiornamento</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Info */}
      {(sensor.garden || sensor.cultivation) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Posizione</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sensor.garden && (
                <div>
                  <span className="font-medium">Giardino:</span>{' '}
                  <span className="text-muted-foreground">{sensor.garden.name}</span>
                </div>
              )}
              {sensor.cultivation && (
                <div>
                  <span className="font-medium">Coltivazione:</span>{' '}
                  <span className="text-muted-foreground">{sensor.cultivation.plantName}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="data" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dati
          </TabsTrigger>
          <TabsTrigger value="connection" className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            Connessione MQTT
          </TabsTrigger>
          <TabsTrigger value="commands" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Comandi
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Dettagli
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          <SensorDataChart
            data={sensorChartData}
            sensorName={sensor.name}
            sensorType={sensor.type}
            unit={sensor.unit}
            thresholds={sensor.thresholds || undefined}
            isLoading={chartLoading}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </TabsContent>

        <TabsContent value="connection">
          {connectionInfo ? (
            <MqttConnectionInfo
              connectionInfo={connectionInfo}
              sensorName={sensor.name}
            />
          ) : connectionLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Caricamento informazioni connessione...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Impossibile caricare le informazioni di connessione</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="commands">
          <SensorCommands
            sensorId={sensor.id}
            sensorName={sensor.name}
            sensorType={sensor.type}
            onSendCommand={handleSendCommand}
            isLoading={commandLoading}
          />
        </TabsContent>

        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informazioni Base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">ID:</span>
                    <br />
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">{sensor.id}</code>
                  </div>
                  <div>
                    <span className="font-medium">Device ID:</span>
                    <br />
                    <span className="text-muted-foreground">{sensor.deviceId}</span>
                  </div>
                  <div>
                    <span className="font-medium">Tipo:</span>
                    <br />
                    <span className="text-muted-foreground">{sensor.type}</span>
                  </div>
                  <div>
                    <span className="font-medium">Unità:</span>
                    <br />
                    <span className="text-muted-foreground">{sensor.unit}</span>
                  </div>
                  <div>
                    <span className="font-medium">Creato:</span>
                    <br />
                    <span className="text-muted-foreground">
                      {new Date(sensor.createdAt).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Aggiornato:</span>
                    <br />
                    <span className="text-muted-foreground">
                      {new Date(sensor.updatedAt).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Configurazione</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Calibration */}
                {sensor.calibration && (
                  <div>
                    <h4 className="font-medium mb-2">Calibrazione</h4>
                    <div className="text-sm space-y-1">
                      {sensor.calibration.offset !== undefined && (
                        <div>Offset: {sensor.calibration.offset}</div>
                      )}
                      {sensor.calibration.multiplier !== undefined && (
                        <div>Moltiplicatore: {sensor.calibration.multiplier}</div>
                      )}
                      {sensor.calibration.lastCalibrated && (
                        <div>
                          Ultima calibrazione: {new Date(sensor.calibration.lastCalibrated).toLocaleDateString('it-IT')}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Thresholds */}
                {sensor.thresholds && (
                  <div>
                    <h4 className="font-medium mb-2">Soglie</h4>
                    <div className="text-sm space-y-1">
                      {sensor.thresholds.min !== undefined && (
                        <div>Minimo: {sensor.thresholds.min} {sensor.unit}</div>
                      )}
                      {sensor.thresholds.optimal_min !== undefined && (
                        <div>Ottimale Min: {sensor.thresholds.optimal_min} {sensor.unit}</div>
                      )}
                      {sensor.thresholds.optimal_max !== undefined && (
                        <div>Ottimale Max: {sensor.thresholds.optimal_max} {sensor.unit}</div>
                      )}
                      {sensor.thresholds.max !== undefined && (
                        <div>Massimo: {sensor.thresholds.max} {sensor.unit}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* MQTT Info */}
                <div>
                  <h4 className="font-medium mb-2">MQTT</h4>
                  <div className="text-sm space-y-1">
                    <div>
                      Topic: <code className="text-xs bg-muted px-1 py-0.5 rounded">{sensor.mqttTopic}</code>
                    </div>
                    <div>
                      Token: <code className="text-xs bg-muted px-1 py-0.5 rounded">{sensor.connectionToken.substring(0, 8)}...</code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SensorDetailPage;