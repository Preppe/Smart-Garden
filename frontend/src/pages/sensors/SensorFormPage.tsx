import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';
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

  // Check if user has gardens
  if (gardens.length === 0 && !gardensLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <BackButton onClick={() => navigate('/sensors')}>Torna ai sensori</BackButton>
          <div></div>
        </div>

        <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun giardino disponibile</h3>
            <p className="text-gray-600 mb-4">Devi creare almeno un giardino prima di aggiungere sensori.</p>
            <Button onClick={() => navigate('/gardens/new')}>Crea il tuo primo giardino</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isEditMode && sensorLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-700 font-medium">Caricamento...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isEditMode && sensorError) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <BackButton onClick={() => navigate('/sensors')}>Torna ai sensori</BackButton>
          <div></div>
        </div>

        <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Errore nel caricamento</h3>
            <p className="text-gray-600 mb-4">
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
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not found state (for edit mode)
  if (isEditMode && !sensorLoading && !sensor) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <BackButton onClick={() => navigate('/sensors')}>Torna ai sensori</BackButton>
          <div></div>
        </div>

        <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sensore non trovato</h3>
            <p className="text-gray-600 mb-4">
              Il sensore che stai cercando di modificare non esiste o non hai i permessi per accedervi
            </p>
            <Button onClick={() => navigate('/sensors')}>
              Torna ai Sensori
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <BackButton onClick={() => navigate('/sensors')}>Torna ai sensori</BackButton>
        <div></div>
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
        <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-medium text-emerald-800">Informazioni Sensore</h3>
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