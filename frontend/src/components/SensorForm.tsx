import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { CreateSensorInput, UpdateSensorInput } from '@/graphql/generated/types';

const sensorFormSchema = z.object({
  deviceId: z.string().min(1, 'Device ID è obbligatorio'),
  name: z.string().min(1, 'Nome è obbligatorio'),
  type: z.enum(['TEMPERATURE', 'HUMIDITY', 'SOIL_MOISTURE', 'LIGHT', 'PH', 'AIR_QUALITY']),
  unit: z.string().min(1, 'Unità di misura è obbligatoria'),
  locationLevel: z.enum(['GARDEN', 'CULTIVATION']),
  gardenId: z.string().optional(),
  cultivationId: z.string().optional(),
  isActive: z.boolean().default(true),
  // Calibration fields
  calibrationOffset: z.number().optional(),
  calibrationMultiplier: z.number().optional(),
  // Thresholds fields
  thresholdMin: z.number().optional(),
  thresholdMax: z.number().optional(),
  thresholdOptimalMin: z.number().optional(),
  thresholdOptimalMax: z.number().optional(),
}).refine((data) => {
  // Validate that gardenId is provided when locationLevel is GARDEN
  if (data.locationLevel === 'GARDEN') {
    return data.gardenId && data.gardenId.trim().length > 0;
  }
  return true;
}, {
  message: 'Giardino è obbligatorio quando il livello è "Giardino"',
  path: ['gardenId'],
}).refine((data) => {
  // Validate that cultivationId is provided when locationLevel is CULTIVATION
  if (data.locationLevel === 'CULTIVATION') {
    return data.cultivationId && data.cultivationId.trim().length > 0;
  }
  return true;
}, {
  message: 'Coltivazione è obbligatoria quando il livello è "Coltivazione"',
  path: ['cultivationId'],
});

type SensorFormData = z.infer<typeof sensorFormSchema>;

interface Garden {
  id: string;
  name: string;
}

interface Cultivation {
  id: string;
  plantName: string;
  garden: {
    id: string;
    name: string;
  };
}

interface SensorFormProps {
  initialData?: Partial<SensorFormData>;
  gardens?: Garden[];
  cultivations?: Cultivation[];
  onSubmit: (data: CreateSensorInput | UpdateSensorInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

const sensorTypeOptions = [
  { value: 'TEMPERATURE', label: 'Temperatura', unit: '°C' },
  { value: 'HUMIDITY', label: 'Umidità', unit: '%' },
  { value: 'SOIL_MOISTURE', label: 'Umidità Suolo', unit: '%' },
  { value: 'LIGHT', label: 'Luce', unit: 'lux' },
  { value: 'PH', label: 'pH', unit: 'pH' },
  { value: 'AIR_QUALITY', label: 'Qualità Aria', unit: 'AQI' },
];

const SensorForm: React.FC<SensorFormProps> = ({
  initialData,
  gardens = [],
  cultivations = [],
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create'
}) => {
  const form = useForm<SensorFormData>({
    resolver: zodResolver(sensorFormSchema),
    defaultValues: {
      deviceId: initialData?.deviceId || '',
      name: initialData?.name || '',
      type: initialData?.type || 'TEMPERATURE',
      unit: initialData?.unit || '°C',
      locationLevel: initialData?.locationLevel || 'GARDEN',
      gardenId: initialData?.gardenId || '',
      cultivationId: initialData?.cultivationId || '',
      isActive: initialData?.isActive ?? true,
      calibrationOffset: initialData?.calibrationOffset,
      calibrationMultiplier: initialData?.calibrationMultiplier || 1,
      thresholdMin: initialData?.thresholdMin,
      thresholdMax: initialData?.thresholdMax,
      thresholdOptimalMin: initialData?.thresholdOptimalMin,
      thresholdOptimalMax: initialData?.thresholdOptimalMax,
    },
  });

  const selectedType = form.watch('type');
  const locationLevel = form.watch('locationLevel');
  const selectedGardenId = form.watch('gardenId');

  // Auto-update unit when sensor type changes
  React.useEffect(() => {
    const typeOption = sensorTypeOptions.find(option => option.value === selectedType);
    if (typeOption) {
      form.setValue('unit', typeOption.unit);
    }
  }, [selectedType, form]);

  // Reset location fields when location level changes
  React.useEffect(() => {
    if (locationLevel === 'GARDEN') {
      form.setValue('cultivationId', '');
    } else if (locationLevel === 'CULTIVATION') {
      // Keep garden selection but ensure cultivation is cleared initially
      form.setValue('cultivationId', '');
    }
  }, [locationLevel, form]);

  // Filter cultivations based on selected garden
  const filteredCultivations = cultivations.filter(
    cultivation => cultivation.garden.id === selectedGardenId
  );

  const handleSubmit = async (data: SensorFormData) => {
    const {
      calibrationOffset,
      calibrationMultiplier,
      thresholdMin,
      thresholdMax,
      thresholdOptimalMin,
      thresholdOptimalMax,
      ...restData
    } = data;

    const submitData: CreateSensorInput | UpdateSensorInput = {
      ...restData,
      calibration: (calibrationOffset !== undefined || calibrationMultiplier !== undefined) ? {
        offset: calibrationOffset,
        multiplier: calibrationMultiplier,
      } : undefined,
      thresholds: (thresholdMin !== undefined || thresholdMax !== undefined || 
                   thresholdOptimalMin !== undefined || thresholdOptimalMax !== undefined) ? {
        min: thresholdMin,
        max: thresholdMax,
        optimal_min: thresholdOptimalMin,
        optimal_max: thresholdOptimalMax,
      } : undefined,
    };

    await onSubmit(submitData);
  };

  return (
    <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-emerald-800">Informazioni Sensore</CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'Configura un nuovo sensore per il monitoraggio IoT'
            : 'Modifica la configurazione del sensore'
          }
        </CardDescription>
      </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="deviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device ID</FormLabel>
                      <FormControl>
                        <Input placeholder="es. temp_001" {...field} />
                      </FormControl>
                      <FormDescription>
                        Identificativo univoco del dispositivo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="es. Sensore Temperatura Serra" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nome descrittivo del sensore
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo Sensore</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sensorTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unità di Misura</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Aggiornata automaticamente in base al tipo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Location Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Posizione</h3>
                
                <FormField
                  control={form.control}
                  name="locationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Livello di Installazione</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona livello" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GARDEN">Giardino</SelectItem>
                          <SelectItem value="CULTIVATION">Coltivazione</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gardenId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Giardino{locationLevel === 'GARDEN' && ' *'}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona giardino" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {gardens.map((garden) => (
                            <SelectItem key={garden.id} value={garden.id}>
                              {garden.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {locationLevel === 'CULTIVATION' && (
                  <FormField
                    control={form.control}
                    name="cultivationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coltivazione *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona coltivazione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredCultivations.map((cultivation) => (
                              <SelectItem key={cultivation.id} value={cultivation.id}>
                                {cultivation.plantName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Separator />

              {/* Advanced Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configurazione Avanzata</h3>
                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Sensore Attivo</FormLabel>
                        <FormDescription>
                          Abilita la raccolta dati dal sensore
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Calibration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="calibrationOffset"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Offset Calibrazione</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.0"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormDescription>
                          Valore da aggiungere alle letture
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="calibrationMultiplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moltiplicatore Calibrazione</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="1.0"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormDescription>
                          Fattore di moltiplicazione per le letture
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Thresholds */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="thresholdMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="thresholdOptimalMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Ottimale</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="20"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="thresholdOptimalMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Ottimale</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="25"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="thresholdMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="40"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-2">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Annulla
                  </Button>
                )}
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {mode === 'create' ? 'Crea Sensore' : 'Salva Modifiche'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
    </Card>
  );
};

export default SensorForm;