import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import { ActionButtons } from '@/components/ui/action-buttons';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Home,
  TreePine,
  Building2,
  MapPin,
  Calendar,
  Sprout,
  Thermometer,
  Droplets,
  Sun,
  Activity,
  Leaf,
} from 'lucide-react';
import { useGetGardenQuery, useDeleteGardenMutation, GardenType, GrowthStage, SensorType } from '@/graphql/generated/types';

const GardenDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data, loading, error } = useGetGardenQuery({
    variables: { id: id! },
    skip: !id,
  });

  const [deleteGarden, { loading: deleting }] = useDeleteGardenMutation({
    onCompleted: () => {
      toast({
        title: 'Garden eliminato',
        description: 'Il garden è stato eliminato con successo.',
      });
      navigate('/gardens');
    },
    onError: (error) => {
      toast({
        title: "Errore nell'eliminazione",
        description: error.message,
        variant: 'destructive',
      });
    },
    refetchQueries: ['GetUserGardens'],
  });

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteGarden({ variables: { id } });
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const getGardenTypeIcon = (type: GardenType) => {
    switch (type) {
      case 'INDOOR':
        return <Home className="w-5 h-5" />;
      case 'OUTDOOR':
        return <TreePine className="w-5 h-5" />;
      case 'GREENHOUSE':
        return <Building2 className="w-5 h-5" />;
      default:
        return <Leaf className="w-5 h-5" />;
    }
  };

  const getGardenTypeColor = (type: GardenType) => {
    switch (type) {
      case 'INDOOR':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'OUTDOOR':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'GREENHOUSE':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getGrowthStageColor = (stage: GrowthStage) => {
    switch (stage) {
      case 'SEED':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'SEEDLING':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'VEGETATIVE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'FLOWERING':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'FRUITING':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'HARVEST':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStageLabel = (stage: GrowthStage) => {
    switch (stage) {
      case 'SEED':
        return 'Seme';
      case 'SEEDLING':
        return 'Piantina';
      case 'VEGETATIVE':
        return 'Vegetativa';
      case 'FLOWERING':
        return 'Fioritura';
      case 'FRUITING':
        return 'Fruttificazione';
      case 'HARVEST':
        return 'Raccolta';
      default:
        return stage;
    }
  };

  const getSensorIcon = (type: SensorType) => {
    switch (type) {
      case 'TEMPERATURE':
        return <Thermometer className="w-4 h-4" />;
      case 'HUMIDITY':
        return <Droplets className="w-4 h-4" />;
      case 'SOIL_MOISTURE':
        return <Sprout className="w-4 h-4" />;
      case 'LIGHT':
        return <Sun className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
        <div className="max-w-7xl mx-auto">
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <p className="text-red-700">Errore nel caricamento del garden: {error.message}</p>
              <BackButton onClick={() => navigate('/gardens')} className="mt-4">
                Torna alla lista
              </BackButton>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!data?.getGarden) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <p className="text-yellow-700">Garden non trovato</p>
              <BackButton onClick={() => navigate('/gardens')} className="mt-4">
                Torna alla lista
              </BackButton>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const garden = data.getGarden;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <BackButton onClick={() => navigate('/gardens')}>Torna ai Garden</BackButton>
        <ActionButtons
          editAction={() => navigate(`/gardens/${garden.id}/edit`)}
          deleteAction={handleDelete}
          deleteConfirmation={{
            title: "Sei sicuro?",
            description: `Questa azione eliminerà permanentemente il garden "${garden.name}" e tutte le sue coltivazioni e sensori. Questa operazione non può essere annullata.`
          }}
          isDeleting={deleting}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Garden Info */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  {getGardenTypeIcon(garden.type)}
                  <span>{garden.name}</span>
                </CardTitle>
                <Badge variant="outline" className={getGardenTypeColor(garden.type)}>
                  {garden.type.toLowerCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {garden.description && <p className="text-gray-700">{garden.description}</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                {garden.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{garden.location.address || `${garden.location.latitude}, ${garden.location.longitude}`}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Creato il {formatDate(garden.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cultivations */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-green-600" />
                  Coltivazioni ({garden.cultivations.length})
                </CardTitle>
                <Link to={`/cultivations/new?gardenId=${garden.id}`}>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Aggiungi
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {garden.cultivations.length === 0 ? (
                <div className="text-center py-8">
                  <Sprout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna coltivazione</h3>
                  <p className="text-gray-600 mb-4">Inizia aggiungendo la prima pianta al tuo garden.</p>
                  <Link to={`/cultivations/new?gardenId=${garden.id}`}>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Aggiungi Coltivazione
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {garden.cultivations.map((cultivation) => (
                    <Link key={cultivation.id} to={`/cultivations/${cultivation.id}`}>
                      <Card className="bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{cultivation.plantName}</h3>
                            <Badge variant="outline" className={getGrowthStageColor(cultivation.growthStage)}>
                              {formatStageLabel(cultivation.growthStage)}
                            </Badge>
                          </div>
                          {cultivation.variety && <p className="text-sm text-gray-600 mb-2">{cultivation.variety}</p>}
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>Piantato il {formatDate(cultivation.plantedDate)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sensors */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Sensori ({garden.sensors.length})
                </CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Aggiungi
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {garden.sensors.length === 0 ? (
                <div className="text-center py-6">
                  <Activity className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Nessun sensore configurato</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {garden.sensors.map((sensor) => (
                    <div key={sensor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getSensorIcon(sensor.type)}
                        <div>
                          <p className="text-sm font-medium">{sensor.name}</p>
                          <p className="text-xs text-gray-500">{sensor.type.toLowerCase().replace('_', ' ')}</p>
                        </div>
                      </div>
                      <Badge variant={sensor.isActive ? 'default' : 'secondary'}>{sensor.isActive ? 'Attivo' : 'Inattivo'}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Statistiche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Coltivazioni totali</span>
                <span className="font-semibold">{garden.cultivations.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sensori attivi</span>
                <span className="font-semibold">{garden.sensors.filter((s) => s.isActive).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sensori totali</span>
                <span className="font-semibold">{garden.sensors.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GardenDetailPage;
