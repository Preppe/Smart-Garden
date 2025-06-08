import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Sprout, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import { ActionButtons } from '@/components/ui/action-buttons';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useGetUserGardensQuery, useDeleteCultivationMutation, GrowthStage } from '@/graphql/generated/types';

const CultivationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: gardensData, loading: gardensLoading } = useGetUserGardensQuery();
  const [deleteCultivation] = useDeleteCultivationMutation();

  // Find the cultivation and its garden
  const cultivationWithGarden = gardensData?.getUserGardens
    ?.flatMap((garden) =>
      garden.cultivations.map((cultivation) => ({
        ...cultivation,
        garden: garden,
      })),
    )
    ?.find((c) => c.id === id);

  const handleDeleteCultivation = async () => {
    if (!cultivationWithGarden) return;

    try {
      await deleteCultivation({
        variables: { id: cultivationWithGarden.id },
        refetchQueries: ['GetUserGardens'],
      });

      toast({
        title: 'Coltivazione eliminata',
        description: `${cultivationWithGarden.plantName} è stata rimossa con successo.`,
      });

      navigate('/cultivations');
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Non è stato possibile eliminare la coltivazione. Riprova.',
        variant: 'destructive',
      });
    }
  };

  const getDaysFromPlanting = (plantedDate: string) => {
    const planted = new Date(plantedDate);
    const today = new Date();
    const diffTime = today.getTime() - planted.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysToHarvest = (harvestDate: string) => {
    const harvest = new Date(harvestDate);
    const today = new Date();
    const diffTime = harvest.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStageColor = (stage: GrowthStage) => {
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

  const formatGardenType = (type: string) => {
    switch (type) {
      case 'INDOOR':
        return 'Interno';
      case 'OUTDOOR':
        return 'Esterno';
      case 'GREENHOUSE':
        return 'Serra';
      default:
        return type;
    }
  };

  if (gardensLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-700 font-medium">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!cultivationWithGarden) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <BackButton onClick={() => navigate('/cultivations')}>Torna alle coltivazioni</BackButton>
          <div></div>
        </div>

        <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Sprout className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Coltivazione non trovata</h3>
            <p className="text-gray-600 mb-4">La coltivazione che stai cercando non esiste o è stata rimossa.</p>
            <Button onClick={() => navigate('/cultivations')}>Vai alle coltivazioni</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <BackButton onClick={() => navigate('/cultivations')}>Torna alle coltivazioni</BackButton>
        <ActionButtons
          editAction={() => navigate(`/cultivations/${id}/edit`)}
          deleteAction={handleDeleteCultivation}
          deleteConfirmation={{
            title: "Elimina coltivazione",
            description: `Sei sicuro di voler eliminare "${cultivationWithGarden.plantName}"? Questa azione non può essere annullata e rimuoverà tutti i dati associati.`
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Growth Status */}
          <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center">
                <Sprout className="mr-2 h-5 w-5" />
                Stato di Crescita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Stadio attuale</p>
                  <Badge className={`${getStageColor(cultivationWithGarden.growthStage)} text-sm mt-1`}>
                    {formatStageLabel(cultivationWithGarden.growthStage)}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Giorni dalla semina</p>
                  <p className="text-2xl font-bold text-emerald-600">{getDaysFromPlanting(cultivationWithGarden.plantedDate)}</p>
                </div>
              </div>

              {cultivationWithGarden.expectedHarvestDate && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-emerald-700 font-medium">Raccolta prevista</p>
                      <p className="text-emerald-600">
                        {new Date(cultivationWithGarden.expectedHarvestDate).toLocaleDateString('it-IT', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-emerald-700">
                        {getDaysToHarvest(cultivationWithGarden.expectedHarvestDate) > 0
                          ? `Fra ${getDaysToHarvest(cultivationWithGarden.expectedHarvestDate)} giorni`
                          : 'Pronta per la raccolta!'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-4"></div>
                  <div>
                    <p className="font-medium">Piantata</p>
                    <p className="text-sm text-gray-600">
                      {new Date(cultivationWithGarden.plantedDate).toLocaleDateString('it-IT', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-medium text-gray-600">Stadio attuale</p>
                    <p className="text-sm text-gray-500">{formatStageLabel(cultivationWithGarden.growthStage)}</p>
                  </div>
                </div>

                {cultivationWithGarden.expectedHarvestDate && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-200 rounded-full mr-4"></div>
                    <div>
                      <p className="font-medium text-gray-500">Raccolta prevista</p>
                      <p className="text-sm text-gray-400">{new Date(cultivationWithGarden.expectedHarvestDate).toLocaleDateString('it-IT')}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {cultivationWithGarden.notes && (
            <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-emerald-800">Note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{cultivationWithGarden.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Garden Info */}
          <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Giardino
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">{cultivationWithGarden.garden.name}</p>
                  <p className="text-sm text-gray-600">{formatGardenType(cultivationWithGarden.garden.type)}</p>
                </div>

                {cultivationWithGarden.garden.description && <p className="text-sm text-gray-700">{cultivationWithGarden.garden.description}</p>}

                {cultivationWithGarden.garden.location?.address && <p className="text-sm text-gray-600">📍 {cultivationWithGarden.garden.location.address}</p>}

                <Separator />

                <Button variant="outline" className="w-full" onClick={() => navigate(`/gardens/${cultivationWithGarden.garden.id}`)}>
                  Vai al giardino
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-800">Statistiche</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Giorni di crescita</span>
                  <span className="font-semibold">{getDaysFromPlanting(cultivationWithGarden.plantedDate)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Stadio</span>
                  <Badge className={getStageColor(cultivationWithGarden.growthStage)}>{formatStageLabel(cultivationWithGarden.growthStage)}</Badge>
                </div>

                {cultivationWithGarden.expectedHarvestDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Giorni alla raccolta</span>
                    <span className="font-semibold text-emerald-600">
                      {getDaysToHarvest(cultivationWithGarden.expectedHarvestDate) > 0
                        ? getDaysToHarvest(cultivationWithGarden.expectedHarvestDate)
                        : 'Pronta!'}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CultivationDetailPage;
