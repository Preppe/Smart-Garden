import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useGetUserGardensQuery, useCreateCultivationMutation, useUpdateCultivationMutation, GrowthStage } from '@/graphql/generated/types';

const CultivationFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const isEditing = Boolean(id);
  const preselectedGardenId = searchParams.get('gardenId');

  // Form state
  const [formData, setFormData] = useState({
    gardenId: preselectedGardenId || '',
    plantName: '',
    variety: '',
    plantedDate: new Date(),
    expectedHarvestDate: null as Date | null,
    growthStage: 'SEEDLING' as GrowthStage,
    notes: '',
  });

  const [showPlantedCalendar, setShowPlantedCalendar] = useState(false);
  const [showHarvestCalendar, setShowHarvestCalendar] = useState(false);

  // GraphQL hooks
  const { data: gardensData, loading: gardensLoading } = useGetUserGardensQuery();
  const [createCultivation, { loading: creating }] = useCreateCultivationMutation();
  const [updateCultivation, { loading: updating }] = useUpdateCultivationMutation();

  // Find cultivation data if editing
  const cultivation = isEditing
    ? gardensData?.getUserGardens?.flatMap((garden) => garden.cultivations.map((c) => ({ ...c, gardenId: garden.id })))?.find((c) => c.id === id)
    : null;

  // Initialize form data for editing
  useEffect(() => {
    if (isEditing && cultivation) {
      setFormData({
        gardenId: cultivation.gardenId || '',
        plantName: cultivation.plantName,
        variety: cultivation.variety || '',
        plantedDate: new Date(cultivation.plantedDate),
        expectedHarvestDate: cultivation.expectedHarvestDate ? new Date(cultivation.expectedHarvestDate) : null,
        growthStage: cultivation.growthStage,
        notes: cultivation.notes || '',
      });
    }
  }, [isEditing, cultivation]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.gardenId || !formData.plantName) {
      toast({
        title: 'Errore di validazione',
        description: 'Giardino e nome della pianta sono obbligatori.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isEditing && id) {
        await updateCultivation({
          variables: {
            id,
            input: {
              plantName: formData.plantName,
              variety: formData.variety || undefined,
              plantedDate: formData.plantedDate,
              expectedHarvestDate: formData.expectedHarvestDate || undefined,
              growthStage: formData.growthStage,
              notes: formData.notes || undefined,
            },
          },
          refetchQueries: ['GetUserGardens'],
        });

        toast({
          title: 'Coltivazione aggiornata',
          description: `${formData.plantName} è stata aggiornata con successo.`,
        });
      } else {
        await createCultivation({
          variables: {
            input: {
              gardenId: formData.gardenId,
              plantName: formData.plantName,
              variety: formData.variety || undefined,
              plantedDate: formData.plantedDate,
              expectedHarvestDate: formData.expectedHarvestDate || undefined,
              growthStage: formData.growthStage,
              notes: formData.notes || undefined,
            },
          },
          refetchQueries: ['GetUserGardens'],
        });

        toast({
          title: 'Coltivazione creata',
          description: `${formData.plantName} è stata aggiunta con successo.`,
        });
      }

      navigate('/cultivations');
    } catch (error) {
      toast({
        title: 'Errore',
        description: `Non è stato possibile ${isEditing ? 'aggiornare' : 'creare'} la coltivazione. Riprova.`,
        variant: 'destructive',
      });
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

  // Check if user has gardens
  const gardens = gardensData?.getUserGardens || [];
  const selectedGarden = gardens.find((g) => g.id === formData.gardenId);
  if (gardens.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <BackButton onClick={() => navigate('/cultivations')}>Torna alle coltivazioni</BackButton>
          <div></div>
        </div>

        <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun giardino disponibile</h3>
            <p className="text-gray-600 mb-4">Devi creare almeno un giardino prima di aggiungere coltivazioni.</p>
            <Button onClick={() => navigate('/gardens/new')}>Crea il tuo primo giardino</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <BackButton onClick={() => navigate('/cultivations')}>Torna alle coltivazioni</BackButton>
        <div></div>
      </div>

      {/* Form */}
      <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-emerald-800">Informazioni Coltivazione</CardTitle>
          <CardDescription>Inserisci i dettagli della tua pianta per monitorarne la crescita</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Garden Selection */}
              <div className="space-y-2">
                <Label htmlFor="garden" className="text-sm font-medium text-gray-700">
                  Giardino *
                </Label>
                <Select
                  value={formData.gardenId}
                  onValueChange={(value) => handleInputChange('gardenId', value)}
                  disabled={isEditing || Boolean(preselectedGardenId)} // Can't change garden when editing or preselected
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona un giardino..." />
                  </SelectTrigger>
                  <SelectContent>
                    {gardens.map((garden) => (
                      <SelectItem key={garden.id} value={garden.id}>
                        {garden.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Plant Name */}
              <div className="space-y-2">
                <Label htmlFor="plantName" className="text-sm font-medium text-gray-700">
                  Nome Pianta *
                </Label>
                <Input
                  id="plantName"
                  value={formData.plantName}
                  onChange={(e) => handleInputChange('plantName', e.target.value)}
                  placeholder="es. Pomodoro, Basilico, Lattuga..."
                  required
                />
              </div>

              {/* Variety */}
              <div className="space-y-2">
                <Label htmlFor="variety" className="text-sm font-medium text-gray-700">
                  Varietà
                </Label>
                <Input
                  id="variety"
                  value={formData.variety}
                  onChange={(e) => handleInputChange('variety', e.target.value)}
                  placeholder="es. San Marzano, Genovese..."
                />
              </div>

              {/* Growth Stage */}
              <div className="space-y-2">
                <Label htmlFor="growthStage" className="text-sm font-medium text-gray-700">
                  Stadio di Crescita
                </Label>
                <Select value={formData.growthStage} onValueChange={(value) => handleInputChange('growthStage', value as GrowthStage)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEED">Seme</SelectItem>
                    <SelectItem value="SEEDLING">Piantina</SelectItem>
                    <SelectItem value="VEGETATIVE">Vegetativa</SelectItem>
                    <SelectItem value="FLOWERING">Fioritura</SelectItem>
                    <SelectItem value="FRUITING">Fruttificazione</SelectItem>
                    <SelectItem value="HARVEST">Raccolta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Planted Date */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Data di Semina *</Label>
                <Popover open={showPlantedCalendar} onOpenChange={setShowPlantedCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !formData.plantedDate && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.plantedDate ? format(formData.plantedDate, 'PPP', { locale: it }) : 'Seleziona data...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.plantedDate}
                      onSelect={(date) => {
                        if (date) {
                          handleInputChange('plantedDate', date);
                          setShowPlantedCalendar(false);
                        }
                      }}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Expected Harvest Date */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Data Raccolta Prevista</Label>
                <Popover open={showHarvestCalendar} onOpenChange={setShowHarvestCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn('w-full justify-start text-left font-normal', !formData.expectedHarvestDate && 'text-muted-foreground')}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expectedHarvestDate ? format(formData.expectedHarvestDate, 'PPP', { locale: it }) : 'Seleziona data (opzionale)...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.expectedHarvestDate || undefined}
                      onSelect={(date) => {
                        handleInputChange('expectedHarvestDate', date || null);
                        setShowHarvestCalendar(false);
                      }}
                      disabled={(date) => date < formData.plantedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {formData.expectedHarvestDate && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInputChange('expectedHarvestDate', null)}
                    className="text-gray-500 hover:text-gray-700 text-xs"
                  >
                    Rimuovi data
                  </Button>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Note
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Aggiungi note sulla coltivazione, cure specifiche, osservazioni..."
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate('/cultivations')}>
                Annulla
              </Button>
              <Button type="submit" disabled={creating || updating}>
                {creating || updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Aggiornamento...' : 'Creazione...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Aggiorna Coltivazione' : 'Crea Coltivazione'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CultivationFormPage;
