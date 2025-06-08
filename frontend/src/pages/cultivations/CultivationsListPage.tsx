import { Plus, Trash2, Edit, Eye, Calendar, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { useToast } from '@/hooks/use-toast';
import { useGetUserCultivationsQuery, useDeleteCultivationMutation, GrowthStage } from '@/graphql/generated/types';

const CultivationsListPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: cultivationsData, loading: cultivationsLoading } = useGetUserCultivationsQuery();
  const [deleteCultivation] = useDeleteCultivationMutation();

  // Get all cultivations directly from the query
  const allCultivations =
    cultivationsData?.getUserCultivations?.map((cultivation) => ({
      ...cultivation,
      gardenName: cultivation.garden.name,
      gardenId: cultivation.garden.id,
    })) || [];

  const handleDeleteCultivation = async (id: string, plantName: string) => {
    try {
      await deleteCultivation({
        variables: { id },
        refetchQueries: ['GetUserCultivations'],
      });

      toast({
        title: 'Coltivazione eliminata',
        description: `${plantName} è stata rimossa con successo.`,
      });
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

  if (cultivationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-700 font-medium">Caricamento coltivazioni...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div></div>
        <Button onClick={() => navigate('/cultivations/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nuova Coltivazione
        </Button>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        {allCultivations.length === 0 ? 'Nessuna coltivazione trovata' : `${allCultivations.length} coltivazioni trovate`}
      </div>

      {/* Cultivations Grid */}
      {allCultivations.length === 0 ? (
        <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Sprout className="mx-auto h-12 w-12 text-emerald-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessuna coltivazione</h3>
            <p className="text-gray-600 mb-4">Non hai ancora aggiunto nessuna coltivazione.</p>
            {allCultivations.length === 0 && (
              <Button onClick={() => navigate('/cultivations/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Aggiungi la prima coltivazione
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCultivations.map((cultivation) => (
            <Card key={cultivation.id} className="border-emerald-200 bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-emerald-800">{cultivation.plantName}</CardTitle>
                    {cultivation.variety && <CardDescription className="text-sm">Varietà: {cultivation.variety}</CardDescription>}
                  </div>
                  <Badge className={`${getStageColor(cultivation.growthStage)} text-xs`}>{formatStageLabel(cultivation.growthStage)}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    Piantata {getDaysFromPlanting(cultivation.plantedDate)} giorni fa
                  </div>

                  <div className="text-sm text-gray-600">
                    <strong>Giardino:</strong> {cultivation.gardenName}
                  </div>

                  {cultivation.expectedHarvestDate && (
                    <div className="text-sm text-gray-600">
                      <strong>Raccolta prevista:</strong> {new Date(cultivation.expectedHarvestDate).toLocaleDateString('it-IT')}
                    </div>
                  )}

                  {cultivation.notes && (
                    <div className="text-sm text-gray-600 line-clamp-2">
                      <strong>Note:</strong> {cultivation.notes}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 pt-1">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/cultivations/${cultivation.id}`)} className="flex-1">
                    <Eye className="mr-1 h-3 w-3" />
                    Dettagli
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => navigate(`/cultivations/${cultivation.id}/edit`)} className="flex-1">
                    <Edit className="mr-1 h-3 w-3" />
                    Modifica
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Elimina coltivazione</AlertDialogTitle>
                        <AlertDialogDescription>
                          Sei sicuro di voler eliminare "{cultivation.plantName}"? Questa azione non può essere annullata.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCultivation(cultivation.id, cultivation.plantName)}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default CultivationsListPage;
