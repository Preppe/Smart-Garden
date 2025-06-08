import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Leaf, Save, Home, TreePine, Building2, MapPin } from 'lucide-react';
import { useCreateGardenMutation, useUpdateGardenMutation, useGetGardenQuery, GardenType } from '@/graphql/generated/types';

interface FormData {
  name: string;
  description: string;
  type: GardenType | '';
  location: {
    address: string;
    latitude: string;
    longitude: string;
  };
}

interface FormErrors {
  name?: string;
  description?: string;
  type?: string;
  location?: {
    address?: string;
    latitude?: string;
    longitude?: string;
  };
}

const GardenFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    type: '',
    location: {
      address: '',
      latitude: '',
      longitude: '',
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch garden data if editing
  const { data: gardenData, loading: loadingGarden } = useGetGardenQuery({
    variables: { id: id! },
    skip: !isEditing,
  });

  const [createGarden, { loading: creating }] = useCreateGardenMutation({
    onCompleted: (data) => {
      toast({
        title: 'Garden creato',
        description: `Il garden "${data.createGarden.name}" è stato creato con successo.`,
      });
      navigate(`/gardens/${data.createGarden.id}`);
    },
    onError: (error) => {
      toast({
        title: 'Errore nella creazione',
        description: error.message,
        variant: 'destructive',
      });
    },
    // Refetch the gardens list after creating
    refetchQueries: ['GetUserGardens'],
  });

  const [updateGarden, { loading: updating }] = useUpdateGardenMutation({
    onCompleted: (data) => {
      toast({
        title: 'Garden aggiornato',
        description: `Il garden "${data.updateGarden.name}" è stato aggiornato con successo.`,
      });
      navigate(`/gardens/${data.updateGarden.id}`);
    },
    onError: (error) => {
      toast({
        title: "Errore nell'aggiornamento",
        description: error.message,
        variant: 'destructive',
      });
    },
    // Refetch the gardens list and garden detail after updating
    refetchQueries: ['GetUserGardens', 'GetGarden'],
  });

  // Populate form data when editing
  useEffect(() => {
    if (isEditing && gardenData?.getGarden) {
      const garden = gardenData.getGarden;
      setFormData({
        name: garden.name,
        description: garden.description || '',
        type: garden.type,
        location: {
          address: garden.location?.address || '',
          latitude: garden.location?.latitude?.toString() || '',
          longitude: garden.location?.longitude?.toString() || '',
        },
      });
    }
  }, [isEditing, gardenData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Il nome è obbligatorio';
    }

    if (!formData.type) {
      newErrors.type = 'Il tipo di garden è obbligatorio';
    }

    // Validate coordinates if provided
    if (formData.location.latitude && isNaN(Number(formData.location.latitude))) {
      newErrors.location = { ...newErrors.location, latitude: 'Latitudine non valida' };
    }

    if (formData.location.longitude && isNaN(Number(formData.location.longitude))) {
      newErrors.location = { ...newErrors.location, longitude: 'Longitudine non valida' };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const input = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      type: formData.type as GardenType,
      location:
        formData.location.address || formData.location.latitude || formData.location.longitude
          ? {
              address: formData.location.address || undefined,
              latitude: formData.location.latitude ? Number(formData.location.latitude) : undefined,
              longitude: formData.location.longitude ? Number(formData.location.longitude) : undefined,
            }
          : undefined,
    };

    try {
      if (isEditing) {
        await updateGarden({
          variables: { id: id!, input },
        });
      } else {
        await createGarden({
          variables: { input },
        });
      }
    } catch (error) {
      // Error handling is done in the mutation's onError callback
      console.error('Form submission error:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INDOOR':
        return <Home className="w-4 h-4" />;
      case 'OUTDOOR':
        return <TreePine className="w-4 h-4" />;
      case 'GREENHOUSE':
        return <Building2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (isEditing && loadingGarden) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <Card className="bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <BackButton onClick={() => navigate('/gardens')}>Torna ai Garden</BackButton>
      </div>
      <form onSubmit={handleSubmit}>
        <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-emerald-800">Informazioni Garden</CardTitle>
            <CardDescription>Inserisci i dettagli del tuo giardino per iniziare a coltivare</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome Garden *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="es. Orto di Casa, Garden Balcone..."
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Descrizione */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrizione</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrivi il tuo garden, le piante che coltivi, gli obiettivi..."
                rows={3}
              />
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo di Garden *</Label>
              <Select value={formData.type} onValueChange={(value: GardenType) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleziona il tipo di garden">
                    {formData.type && (
                      <div className="flex items-center gap-2">
                        {getTypeIcon(formData.type)}
                        <span className="capitalize">{formData.type.toLowerCase()}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INDOOR">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      <span>Indoor - Casa/Appartamento</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="OUTDOOR">
                    <div className="flex items-center gap-2">
                      <TreePine className="w-4 h-4" />
                      <span>Outdoor - Giardino/Terrazzo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="GREENHOUSE">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>Greenhouse - Serra</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
            </div>

            {/* Location */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Posizione (opzionale)
              </Label>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="address" className="text-sm text-gray-600">
                    Indirizzo
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.location.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, address: e.target.value },
                      })
                    }
                    placeholder="Via, Città, Paese..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="latitude" className="text-sm text-gray-600">
                      Latitudine
                    </Label>
                    <Input
                      id="latitude"
                      type="text"
                      value={formData.location.latitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: { ...formData.location, latitude: e.target.value },
                        })
                      }
                      placeholder="es. 45.4642"
                      className={errors.location?.latitude ? 'border-red-500' : ''}
                    />
                    {errors.location?.latitude && <p className="text-xs text-red-600 mt-1">{errors.location.latitude}</p>}
                  </div>

                  <div>
                    <Label htmlFor="longitude" className="text-sm text-gray-600">
                      Longitudine
                    </Label>
                    <Input
                      id="longitude"
                      type="text"
                      value={formData.location.longitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: { ...formData.location, longitude: e.target.value },
                        })
                      }
                      placeholder="es. 9.1900"
                      className={errors.location?.longitude ? 'border-red-500' : ''}
                    />
                    {errors.location?.longitude && <p className="text-xs text-red-600 mt-1">{errors.location.longitude}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/gardens')} disabled={creating || updating}>
                Annulla
              </Button>
              <Button type="submit" disabled={creating || updating}>
                <Save className="w-4 h-4 mr-2" />
                {creating || updating ? (isEditing ? 'Aggiornamento...' : 'Creazione...') : isEditing ? 'Aggiorna Garden' : 'Crea Garden'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default GardenFormPage;
