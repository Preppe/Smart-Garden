import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Send, Settings, Zap, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const commandSchema = z.object({
  command: z.string().min(1, 'Comando è obbligatorio'),
  parameters: z.string().optional(),
});

type CommandFormData = z.infer<typeof commandSchema>;

interface SensorCommandsProps {
  sensorId: string;
  sensorName: string;
  sensorType: string;
  onSendCommand: (command: string, parameters?: Record<string, any>) => Promise<void>;
  isLoading?: boolean;
}

const predefinedCommands = [
  {
    command: 'calibrate',
    label: 'Calibra Sensore',
    description: 'Calibra il sensore con offset e moltiplicatore',
    icon: <Settings className="h-4 w-4" />,
    parameters: {
      offset: 0,
      multiplier: 1.0,
    },
  },
  {
    command: 'reset',
    label: 'Reset Sensore',
    description: 'Riavvia il sensore',
    icon: <RefreshCw className="h-4 w-4" />,
    parameters: {},
  },
  {
    command: 'set_interval',
    label: 'Imposta Intervallo',
    description: 'Modifica la frequenza di invio dati (secondi)',
    icon: <Zap className="h-4 w-4" />,
    parameters: {
      interval: 60,
    },
  },
  {
    command: 'ping',
    label: 'Test Connessione',
    description: 'Verifica la connessione del sensore',
    icon: <Send className="h-4 w-4" />,
    parameters: {},
  },
];

const SensorCommands: React.FC<SensorCommandsProps> = ({
  sensorId,
  sensorName,
  sensorType,
  onSendCommand,
  isLoading = false,
}) => {
  const [selectedCommand, setSelectedCommand] = useState<typeof predefinedCommands[0] | null>(null);
  const [customParameters, setCustomParameters] = useState<string>('{}');
  const [sendingCommand, setSendingCommand] = useState<string | null>(null);

  const form = useForm<CommandFormData>({
    resolver: zodResolver(commandSchema),
    defaultValues: {
      command: '',
      parameters: '{}',
    },
  });

  const handlePredefinedCommand = async (cmd: typeof predefinedCommands[0]) => {
    setSendingCommand(cmd.command);
    try {
      await onSendCommand(cmd.command, cmd.parameters);
      toast({
        title: "Comando inviato",
        description: `Comando "${cmd.label}" inviato al sensore ${sensorName}`,
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile inviare il comando",
        variant: "destructive",
      });
    } finally {
      setSendingCommand(null);
    }
  };

  const handleCustomCommand = async (data: CommandFormData) => {
    setSendingCommand(data.command);
    try {
      let parameters: Record<string, any> | undefined;
      
      if (data.parameters && data.parameters.trim()) {
        try {
          parameters = JSON.parse(data.parameters);
        } catch (error) {
          toast({
            title: "Errore",
            description: "Parametri JSON non validi",
            variant: "destructive",
          });
          return;
        }
      }

      await onSendCommand(data.command, parameters);
      toast({
        title: "Comando inviato",
        description: `Comando personalizzato "${data.command}" inviato al sensore ${sensorName}`,
      });
      
      // Reset form
      form.reset();
      setCustomParameters('{}');
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile inviare il comando",
        variant: "destructive",
      });
    } finally {
      setSendingCommand(null);
    }
  };

  const handleCommandSelect = (command: string) => {
    const cmd = predefinedCommands.find(c => c.command === command);
    if (cmd) {
      setSelectedCommand(cmd);
      form.setValue('command', cmd.command);
      form.setValue('parameters', JSON.stringify(cmd.parameters, null, 2));
      setCustomParameters(JSON.stringify(cmd.parameters, null, 2));
    }
  };

  return (
    <div className="space-y-6">
      {/* Predefined Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Comandi Rapidi
          </CardTitle>
          <CardDescription>
            Comandi predefiniti per il sensore <strong>{sensorName}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predefinedCommands.map((cmd) => (
              <div
                key={cmd.command}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {cmd.icon}
                    <span className="font-medium">{cmd.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {cmd.command}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {cmd.description}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handlePredefinedCommand(cmd)}
                  disabled={isLoading || sendingCommand === cmd.command}
                >
                  {sendingCommand === cmd.command ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Custom Command */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Comando Personalizzato
          </CardTitle>
          <CardDescription>
            Invia un comando personalizzato al sensore
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCustomCommand)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="command"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comando</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="es. set_threshold" {...field} />
                        </FormControl>
                        <Select onValueChange={handleCommandSelect}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Predefiniti" />
                          </SelectTrigger>
                          <SelectContent>
                            {predefinedCommands.map((cmd) => (
                              <SelectItem key={cmd.command} value={cmd.command}>
                                {cmd.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormDescription>
                        Nome del comando da inviare al sensore
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Anteprima Comando</label>
                  <div className="p-3 bg-muted rounded border">
                    {selectedCommand ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {selectedCommand.icon}
                          <span className="font-medium">{selectedCommand.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {selectedCommand.description}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Seleziona o inserisci un comando
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="parameters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parametri (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{"key": "value"}'
                        className="min-h-[100px] font-mono text-sm"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setCustomParameters(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Parametri del comando in formato JSON (opzionale)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Parameter validation */}
              {customParameters && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Validazione Parametri</label>
                  <div className="p-3 bg-muted rounded border">
                    {(() => {
                      try {
                        const parsed = JSON.parse(customParameters);
                        return (
                          <div className="space-y-1">
                            <Badge variant="secondary" className="text-xs">
                              JSON Valido ✓
                            </Badge>
                            <pre className="text-xs text-muted-foreground overflow-auto">
                              {JSON.stringify(parsed, null, 2)}
                            </pre>
                          </div>
                        );
                      } catch (error) {
                        return (
                          <div className="space-y-1">
                            <Badge variant="destructive" className="text-xs">
                              JSON Non Valido ✗
                            </Badge>
                            <p className="text-xs text-red-600">
                              {error instanceof Error ? error.message : 'Errore di parsing'}
                            </p>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isLoading || sendingCommand === form.getValues('command')}
                >
                  {sendingCommand === form.getValues('command') ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Invia Comando
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SensorCommands;