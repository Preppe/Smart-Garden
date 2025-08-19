import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import SensorCard from '@/components/SensorCard';
import { useGetUserSensorsQuery, useDeleteSensorMutation } from '@/graphql/generated/types';
import EntityListPage from '@/components/EntityListPage';

const SensorsListPage: React.FC = () => {
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useGetUserSensorsQuery();
  const [deleteSensor] = useDeleteSensorMutation();

  const sensors = data?.getUserSensors || [];

  // Statistics
  const stats = {
    total: sensors.length,
    active: sensors.filter(s => s.isActive).length,
    connected: sensors.filter(s => {
      if (!s.lastDataReceived) return false;
      const diffMinutes = (new Date().getTime() - new Date(s.lastDataReceived).getTime()) / (1000 * 60);
      return diffMinutes <= 5;
    }).length,
    disconnected: sensors.filter(s => {
      if (!s.lastDataReceived) return true;
      const diffMinutes = (new Date().getTime() - new Date(s.lastDataReceived).getTime()) / (1000 * 60);
      return diffMinutes > 5;
    }).length,
  };

  const handleDeleteSensor = async (sensorId: string) => {
    try {
      await deleteSensor({ 
        variables: { id: sensorId },
        refetchQueries: ['GetUserSensors']
      });
      
      toast({
        title: "Sensore eliminato",
        description: "Il sensore è stato eliminato con successo",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile eliminare il sensore",
        variant: "destructive",
      });
    }
  };

  const renderStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Totale</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Attivi</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.connected}</div>
            <div className="text-sm text-muted-foreground">Connessi</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.disconnected}</div>
            <div className="text-sm text-muted-foreground">Disconnessi</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSensorCard = (sensor: any) => (
    <SensorCard
      key={sensor.id}
      sensor={sensor}
      onDelete={() => handleDeleteSensor(sensor.id)}
    />
  );

  return (
    <EntityListPage
      items={sensors}
      loading={loading}
      error={error}
      emptyIcon={Activity}
      emptyTitle="Nessun sensore configurato"
      emptyDescription="Inizia creando il tuo primo sensore IoT"
      createButtonText="Nuovo Sensore"
      onCreateNew={() => navigate('/sensors/new')}
      renderCard={renderSensorCard}
      showStats={true}
      renderStats={renderStats}
    />
  );
};

export default SensorsListPage;