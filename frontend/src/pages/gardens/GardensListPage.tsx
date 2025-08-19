import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, TreePine, Building2, Leaf, MapPin, Calendar, Sprout, Eye, Edit } from 'lucide-react';
import { useGetUserGardensQuery, GardenType } from '@/graphql/generated/types';
import { useAuthStore } from '@/stores/authStore';
import EntityListPage from '@/components/EntityListPage';

const GardensListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data, loading, error } = useGetUserGardensQuery({
    skip: !user,
  });

  const gardens = data?.getUserGardens || [];

  const getGardenTypeIcon = (type: GardenType) => {
    switch (type) {
      case 'INDOOR':
        return <Home className="w-4 h-4" />;
      case 'OUTDOOR':
        return <TreePine className="w-4 h-4" />;
      case 'GREENHOUSE':
        return <Building2 className="w-4 h-4" />;
      default:
        return <Leaf className="w-4 h-4" />;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderGardenCard = (garden: any) => (
    <Card key={garden.id} className="border-emerald-200 bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-emerald-800 mb-2">{garden.name}</CardTitle>
            {garden.description && <p className="text-sm text-gray-600 line-clamp-2">{garden.description}</p>}
          </div>
          <Badge variant="outline" className={getGardenTypeColor(garden.type as GardenType)}>
            {getGardenTypeIcon(garden.type as GardenType)}
            <span className="ml-1 capitalize">{garden.type.toLowerCase()}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="space-y-3">
          {/* Location */}
          {garden.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="truncate">{garden.location.address || `${garden.location.latitude}, ${garden.location.longitude}`}</span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-green-600">
              <Sprout className="w-4 h-4 mr-1" />
              <span>{garden.cultivations?.length || 0} coltivazioni</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(garden.createdAt)}</span>
            </div>
          </div>

          {/* Cultivations Preview */}
          {garden.cultivations && garden.cultivations.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Coltivazioni:</p>
              <div className="flex flex-wrap gap-1">
                {garden.cultivations.slice(0, 3).map((cultivation) => (
                  <Badge key={cultivation.id} variant="secondary" className="text-xs">
                    {cultivation.plantName}
                  </Badge>
                ))}
                {garden.cultivations.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{garden.cultivations.length - 3} altre
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-2 pt-1">
          <Button variant="outline" size="sm" onClick={() => navigate(`/gardens/${garden.id}`)} className="flex-1">
            <Eye className="mr-1 h-3 w-3" />
            Dettagli
          </Button>

          <Button variant="outline" size="sm" onClick={() => navigate(`/gardens/${garden.id}/edit`)} className="flex-1">
            <Edit className="mr-1 h-3 w-3" />
            Modifica
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <EntityListPage
      items={gardens}
      loading={loading}
      error={error}
      emptyIcon={Leaf}
      emptyTitle="Nessun garden trovato"
      emptyDescription="Inizia creando il tuo primo garden smart per monitorare le tue piante."
      createButtonText="Nuovo Garden"
      onCreateNew={() => navigate('/gardens/new')}
      renderCard={renderGardenCard}
    />
  );
};

export default GardensListPage;
