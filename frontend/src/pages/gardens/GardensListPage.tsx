import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Home, TreePine, Building2, Leaf, MapPin, Calendar, Sprout } from 'lucide-react';
import { useGetUserGardensQuery, GardenType } from '@/graphql/generated/types';
import { useAuthStore } from '@/stores/authStore';

const GardensListPage = () => {

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
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
              <p className="text-red-700">Errore nel caricamento dei garden: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div></div>
        <Link to="/gardens/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuovo Garden
          </Button>
        </Link>
      </div>
      <div>
        {/* Search and Filters */}

        {/* Gardens Grid */}
        {gardens.length === 0 ? (
          <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun garden trovato</h3>
              <p className="text-gray-600 mb-6">Inizia creando il tuo primo garden smart per monitorare le tue piante.</p>
              {gardens.length === 0 && (
                <Link to="/gardens/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Crea il primo Garden
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gardens.map((garden) => (
              <Link key={garden.id} to={`/gardens/${garden.id}`}>
                <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-2">{garden.name}</CardTitle>
                        {garden.description && <p className="text-sm text-gray-600 line-clamp-2">{garden.description}</p>}
                      </div>
                      <Badge variant="outline" className={getGardenTypeColor(garden.type as GardenType)}>
                        {getGardenTypeIcon(garden.type as GardenType)}
                        <span className="ml-1 capitalize">{garden.type.toLowerCase()}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
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
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Summary */}
        {gardens.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            Visualizzando {gardens.length} garden
          </div>
        )}
      </div>
    </div>
  );
};

export default GardensListPage;
