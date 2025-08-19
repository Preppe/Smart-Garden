import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import SensorForm from '@/components/SensorForm';
import { 
  useGetSensorQuery,
  useGetUserGardensQuery,
  useGetUserCultivationsQuery,
  useCreateNewSensorMutation,
  useUpdateExistingSensorMutation,
  CreateSensorInput,
  UpdateSensorInput
} from '@/graphql/generated/types';

const SensorFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // GraphQL hooks
  const { data: sensorData, loading: sensorLoading, error: sensorError } = useGetSensorQuery({
    variables: { id: id! },
    skip: !isEditMode,
  });

  const { data: gardensData, loading: gardensLoading } = useGetUserGardensQuery();
  const { data: cultivationsData, loading: cultivationsLoading } = useGetUserCultivationsQuery();

  const [createSensor, { loading: createLoading }] = useCreateNewSensorMutation();
  const [updateSensor, { loading: updateLoading }] = useUpdateExistingSensorMutation();

  const sensor = sensorData?.getSensor;
  const gardens = gardensData?.getUserGardens || [];
  const cultivations = cultivationsData?.getUserCultivations || [];

  const isLoading = sensorLoading || gardensLoading || cultivationsLoading || createLoading || updateLoading;

  // Prepare initial data for edit mode
  const initialData = sensor ? {
    deviceId: sensor.deviceId,
    name: sensor.name,
    type: sensor.type,
    unit: sensor.unit,
    locationLevel: sensor.locationLevel,
    gardenId: sensor.garden?.id,
    cultivationId: sensor.cultivation?.id,
    isActive: sensor.isActive,
    calibrationOffset: sensor.calibration?.offset,
    calibrationMultiplier: sensor.calibration?.multiplier,
    thresholdMin: sensor.thresholds?.min,
    thresholdMax: sensor.thresholds?.max,
    thresholdOptimalMin: sensor.thresholds?.optimal_min,
    thresholdOptimalMax: sensor.thresholds?.optimal_max,
  } : undefined;

  const handleSubmit = async (data: CreateSensorInput | UpdateSensorInput) => {
    try {
      if (isEditMode && id) {
        // Update existing sensor
        await updateSensor({
          variables: {
            id,
            input: data as UpdateSensorInput,
          },
          refetchQueries: ['GetUserSensors', 'GetSensor'],
        });

        toast({
          title: "Sensore aggiornato",
          description: "Il sensore è stato aggiornato con successo",
        });
      } else {
        // Create new sensor
        const result = await createSensor({
          variables: {
            input: data as CreateSensorInput,
          },
          refetchQueries: ['GetUserSensors'],
        });

        toast({
          title: "Sensore creato",
          description: "Il nuovo sensore è stato creato con successo",
        });

        // Redirect to the new sensor's detail page
        if (result.data?.createSensor?.id) {
          navigate(`/sensors/${result.data.createSensor.id}`);
          return;
        }
      }

      // Redirect to sensors list
      navigate('/sensors');
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Impossibile salvare il sensore",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/sensors');
  };

  // Loading state
  if (isEditMode && sensorLoading) {
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
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-10 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isEditMode && sensorError) {
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
              <h3 className="text-lg font-semibold mb-2">Errore nel caricamento</h3>
              <p className="text-muted-foreground mb-4">
                Impossibile caricare i dati del sensore
              </p>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Riprova
                </Button>
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

  // Not found state (for edit mode)
  if (isEditMode && !sensorLoading && !sensor) {
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
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sensore non trovato</h3>
              <p className="text-muted-foreground mb-4">
                Il sensore che stai cercando di modificare non esiste o non hai i permessi per accedervi
              </p>
              <Button onClick={() => navigate('/sensors')}>
                Torna ai Sensori
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/sensors')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna ai Sensori
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditMode ? 'Modifica Sensore' : 'Nuovo Sensore'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode 
              ? `Modifica la configurazione del sensore ${sensor?.name}`
              : 'Configura un nuovo sensore per il monitoraggio IoT'
            }
          </p>
        </div>
      </div>

      {/* Form */}
      <SensorForm
        mode={isEditMode ? 'edit' : 'create'}
        initialData={initialData}
        gardens={gardens}
        cultivations={cultivations}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />

      {/* Additional info for edit mode */}
      {isEditMode && sensor && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-medium">Informazioni Sensore</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">ID:</span>
                  <br />
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{sensor.id}</code>
                </div>
                <div>
                  <span className="font-medium">Topic MQTT:</span>
                  <br />
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{sensor.mqttTopic}</code>
                </div>
                <div>
                  <span className="font-medium">Creato:</span>
                  <br />
                  <span className="text-muted-foreground">
                    {new Date(sensor.createdAt).toLocaleDateString('it-IT', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SensorFormPage;