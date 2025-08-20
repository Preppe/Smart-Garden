import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Eye, EyeOff, Wifi, MessageSquare, Server } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { GetMqttConnectionInfoQuery } from '@/graphql/generated/types';

interface MqttConnectionInfoProps {
  connectionInfo: GetMqttConnectionInfoQuery['getMqttConnectionInfo'];
  sensorName: string;
}

const MqttConnectionInfo: React.FC<MqttConnectionInfoProps> = ({ 
  connectionInfo, 
  sensorName 
}) => {
  const [showToken, setShowToken] = useState(false);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiato!",
        description: `${label} copiato negli appunti`,
      });
    } catch (err) {
      toast({
        title: "Errore",
        description: "Impossibile copiare negli appunti",
        variant: "destructive",
      });
    }
  };

  const formatConnectionString = () => {
    return `mqtt://${connectionInfo.host}:${connectionInfo.port}`;
  };

  const formatWebSocketConnectionString = () => {
    return `ws://${connectionInfo.host}:${connectionInfo.wsPort}`;
  };

  const examplePayload = {
    value: 23.5,
    timestamp: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
    token: connectionInfo.token
  };

  const exampleCommand = {
    command: "calibrate",
    parameters: {
      offset: 0.5,
      multiplier: 1.02
    },
    timestamp: Math.floor(Date.now() / 1000) // Unix timestamp in seconds
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Informazioni Connessione MQTT
          </CardTitle>
          <CardDescription>
            Usa queste informazioni per configurare il sensore <strong>{sensorName}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Host MQTT</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-2 py-1 bg-muted rounded text-sm">
                  {connectionInfo.host}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(connectionInfo.host, 'Host')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Porta MQTT</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-2 py-1 bg-muted rounded text-sm">
                  {connectionInfo.port}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(connectionInfo.port.toString(), 'Porta')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Porta WebSocket</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-2 py-1 bg-muted rounded text-sm">
                  {connectionInfo.wsPort}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(connectionInfo.wsPort.toString(), 'Porta WebSocket')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Keep Alive</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-2 py-1 bg-muted rounded text-sm">
                  {connectionInfo.keepalive}s
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(connectionInfo.keepalive.toString(), 'Keep Alive')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Connection Strings */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Server className="h-4 w-4" />
              Stringhe di Connessione
            </h4>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">MQTT Standard</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-2 py-1 bg-muted rounded text-sm">
                  {formatConnectionString()}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(formatConnectionString(), 'Stringa connessione MQTT')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">WebSocket</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-2 py-1 bg-muted rounded text-sm">
                  {formatWebSocketConnectionString()}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(formatWebSocketConnectionString(), 'Stringa connessione WebSocket')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Topics */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Topics MQTT
            </h4>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Topic Invio Dati</label>
                  <Badge variant="secondary">Publish</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-2 py-1 bg-muted rounded text-sm">
                    {connectionInfo.dataTopicPublish}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(connectionInfo.dataTopicPublish, 'Topic dati')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Topic Ricezione Comandi</label>
                  <Badge variant="outline">Subscribe</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-2 py-1 bg-muted rounded text-sm">
                    {connectionInfo.commandTopicSubscribe}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(connectionInfo.commandTopicSubscribe, 'Topic comandi')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Topic Status</label>
                  <Badge variant="secondary">Publish</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-2 py-1 bg-muted rounded text-sm">
                    {connectionInfo.statusTopicPublish}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(connectionInfo.statusTopicPublish, 'Topic status')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Authentication Token */}
          <div className="space-y-4">
            <h4 className="font-medium">Token di Autenticazione</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="flex-1 px-2 py-1 bg-muted rounded text-sm font-mono">
                  {showToken ? connectionInfo.token : '••••••••••••••••••••••••••••••••••••••••'}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(connectionInfo.token, 'Token')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Includi questo token nel payload di ogni messaggio per l'autenticazione
              </p>
            </div>
          </div>

          <Separator />

          {/* Client ID */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Prefisso Client ID</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-2 py-1 bg-muted rounded text-sm">
                {connectionInfo.clientIdPrefix}[ID_UNIVOCO]
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(connectionInfo.clientIdPrefix, 'Prefisso Client ID')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Aggiungi un ID univoco al prefisso per evitare conflitti
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Example Payloads */}
      <Card>
        <CardHeader>
          <CardTitle>Esempi di Payload</CardTitle>
          <CardDescription>
            Formati dei messaggi per l'invio di dati e la ricezione di comandi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Esempio Invio Dati</label>
            <div className="relative">
              <pre className="bg-muted p-3 rounded text-sm overflow-auto">
                <code>{JSON.stringify(examplePayload, null, 2)}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(JSON.stringify(examplePayload, null, 2), 'Esempio payload dati')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Esempio Ricezione Comando</label>
            <div className="relative">
              <pre className="bg-muted p-3 rounded text-sm overflow-auto">
                <code>{JSON.stringify(exampleCommand, null, 2)}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(JSON.stringify(exampleCommand, null, 2), 'Esempio comando')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MqttConnectionInfo;