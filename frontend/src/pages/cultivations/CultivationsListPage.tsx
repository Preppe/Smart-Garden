import { Trash2, Edit, Eye, Calendar, Sprout } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
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
import EntityListPage from '@/components/EntityListPage';

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

  const renderCultivationCard = (cultivation: any) => (
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
          <Link to={`/cultivations/${cultivation.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-blue-600 hover:bg-blue-50 hover:border-blue-300">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>

          <Link to={`/cultivations/${cultivation.id}/edit`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-green-600 hover:bg-green-50 hover:border-green-300">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:border-red-300">
                <Trash2 className="h-4 w-4" />
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
  );

  return (
    <EntityListPage
      items={allCultivations}
      loading={cultivationsLoading}
      error={null}
      emptyIcon={Sprout}
      emptyTitle="Nessuna coltivazione"
      emptyDescription="Non hai ancora aggiunto nessuna coltivazione."
      createButtonText="Nuova Coltivazione"
      onCreateNew={() => navigate('/cultivations/new')}
      renderCard={renderCultivationCard}
    />
  );
};

export default CultivationsListPage;
