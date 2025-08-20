import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format, subDays, subHours, subMinutes } from 'date-fns';
import { it } from 'date-fns/locale';
import { GetSensorDataQuery } from '@/graphql/generated/types';

type SensorDataPoint = GetSensorDataQuery['getSensorData'][0];

interface SensorDataChartProps {
  data: SensorDataPoint[];
  sensorName: string;
  sensorType: string;
  unit: string;
  thresholds?: {
    min?: number;
    max?: number;
    optimal_min?: number;
    optimal_max?: number;
  };
  isLoading?: boolean;
  onTimeRangeChange?: (timeRange: string) => void;
}

const timeRangeOptions = [
  { value: '1h', label: 'Ultima ora', duration: 60 },
  { value: '6h', label: 'Ultime 6 ore', duration: 360 },
  { value: '24h', label: 'Ultimo giorno', duration: 1440 },
  { value: '7d', label: 'Ultima settimana', duration: 10080 },
  { value: '30d', label: 'Ultimo mese', duration: 43200 },
];

const getSensorColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'temperature':
      return '#ef4444'; // red
    case 'humidity':
      return '#3b82f6'; // blue
    case 'soil_moisture':
      return '#06b6d4'; // cyan
    case 'light':
      return '#f59e0b'; // amber
    case 'ph':
      return '#8b5cf6'; // violet
    case 'air_quality':
      return '#10b981'; // emerald
    default:
      return '#6b7280'; // gray
  }
};

const formatValue = (value: number, unit: string) => {
  return `${value.toFixed(1)} ${unit}`;
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
  return format(date, 'HH:mm', { locale: it });
};

const formatTooltipTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
  return format(date, 'dd/MM HH:mm', { locale: it });
};

const SensorDataChart: React.FC<SensorDataChartProps> = ({
  data,
  sensorName,
  sensorType,
  unit,
  thresholds,
  isLoading = false,
  onTimeRangeChange,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  
  const lineColor = getSensorColor(sensorType);

  // Transform data for chart
  const chartData = useMemo(() => {
    return data.map(point => ({
      time: point.time,
      value: point.value,
      formattedTime: formatTime(point.time),
      fullTime: formatTooltipTime(point.time),
    })).sort((a, b) => a.time - b.time); // Direct numeric comparison for Unix timestamps
  }, [data]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return { min: 0, max: 0, avg: 0, latest: 0, trend: 'stable' as const };
    }

    const values = chartData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const latest = values[values.length - 1];
    
    // Simple trend calculation (compare last 10% with first 10%)
    const splitPoint = Math.floor(values.length * 0.1);
    const firstPart = values.slice(0, splitPoint || 1);
    const lastPart = values.slice(-splitPoint || -1);
    
    const firstAvg = firstPart.reduce((sum, val) => sum + val, 0) / firstPart.length;
    const lastAvg = lastPart.reduce((sum, val) => sum + val, 0) / lastPart.length;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    const threshold = avg * 0.05; // 5% threshold
    
    if (lastAvg > firstAvg + threshold) trend = 'up';
    else if (lastAvg < firstAvg - threshold) trend = 'down';

    return { min, max, avg, latest, trend };
  }, [chartData]);

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value);
    if (onTimeRangeChange) {
      onTimeRangeChange(value);
    }
  };

  const getTrendIcon = () => {
    switch (stats.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendLabel = () => {
    switch (stats.trend) {
      case 'up':
        return 'In crescita';
      case 'down':
        return 'In calo';
      default:
        return 'Stabile';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {sensorName}
              <Badge variant="secondary">{sensorType}</Badge>
            </CardTitle>
            <CardDescription>
              Dati storici del sensore
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: lineColor }}>
              {formatValue(stats.latest, unit)}
            </div>
            <div className="text-xs text-muted-foreground">Ultimo valore</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {formatValue(stats.min, unit)}
            </div>
            <div className="text-xs text-muted-foreground">Minimo</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {formatValue(stats.avg, unit)}
            </div>
            <div className="text-xs text-muted-foreground">Media</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">
              {formatValue(stats.max, unit)}
            </div>
            <div className="text-xs text-muted-foreground">Massimo</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              {getTrendIcon()}
              <span className="text-sm font-medium">{getTrendLabel()}</span>
            </div>
            <div className="text-xs text-muted-foreground">Tendenza</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Caricamento dati...</p>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">Nessun dato disponibile</p>
              <p className="text-sm text-muted-foreground">
                I dati del sensore appariranno qui una volta ricevuti
              </p>
            </div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="formattedTime" 
                  className="text-xs fill-gray-600"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs fill-gray-600"
                  tick={{ fontSize: 12 }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium">{data.fullTime}</p>
                          <p className="text-sm" style={{ color: lineColor }}>
                            {`${sensorType}: ${formatValue(payload[0].value as number, unit)}`}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                
                {/* Threshold lines */}
                {thresholds?.min !== undefined && (
                  <ReferenceLine 
                    y={thresholds.min} 
                    stroke="#ef4444" 
                    strokeDasharray="5 5" 
                    label={{ value: `Min: ${thresholds.min}`, position: "insideTopRight" }}
                  />
                )}
                {thresholds?.max !== undefined && (
                  <ReferenceLine 
                    y={thresholds.max} 
                    stroke="#ef4444" 
                    strokeDasharray="5 5"
                    label={{ value: `Max: ${thresholds.max}`, position: "insideTopRight" }}
                  />
                )}
                {thresholds?.optimal_min !== undefined && (
                  <ReferenceLine 
                    y={thresholds.optimal_min} 
                    stroke="#10b981" 
                    strokeDasharray="2 2"
                    label={{ value: `Opt Min: ${thresholds.optimal_min}`, position: "insideTopRight" }}
                  />
                )}
                {thresholds?.optimal_max !== undefined && (
                  <ReferenceLine 
                    y={thresholds.optimal_max} 
                    stroke="#10b981" 
                    strokeDasharray="2 2"
                    label={{ value: `Opt Max: ${thresholds.optimal_max}`, position: "insideTopRight" }}
                  />
                )}

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={lineColor}
                  strokeWidth={2}
                  dot={{ fill: lineColor, strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, fill: lineColor }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Threshold legend */}
        {thresholds && (
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            {thresholds.min !== undefined && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-red-500" style={{ borderTop: '1px dashed' }}></div>
                <span>Min: {thresholds.min} {unit}</span>
              </div>
            )}
            {thresholds.optimal_min !== undefined && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-green-500" style={{ borderTop: '1px dashed' }}></div>
                <span>Ottimale Min: {thresholds.optimal_min} {unit}</span>
              </div>
            )}
            {thresholds.optimal_max !== undefined && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-green-500" style={{ borderTop: '1px dashed' }}></div>
                <span>Ottimale Max: {thresholds.optimal_max} {unit}</span>
              </div>
            )}
            {thresholds.max !== undefined && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-red-500" style={{ borderTop: '1px dashed' }}></div>
                <span>Max: {thresholds.max} {unit}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SensorDataChart;