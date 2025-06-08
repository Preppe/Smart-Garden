import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SensorChart = () => {
  const data = [
    { time: '00:00', temperature: 22, humidity: 65, soilMoisture: 48 },
    { time: '04:00', temperature: 20, humidity: 70, soilMoisture: 46 },
    { time: '08:00', temperature: 23, humidity: 68, soilMoisture: 44 },
    { time: '12:00', temperature: 26, humidity: 62, soilMoisture: 42 },
    { time: '16:00', temperature: 28, humidity: 58, soilMoisture: 40 },
    { time: '20:00', temperature: 25, humidity: 64, soilMoisture: 45 },
    { time: '24:00', temperature: 24, humidity: 68, soilMoisture: 47 },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="time" className="text-sm fill-gray-600" />
          <YAxis className="text-sm fill-gray-600" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            name="Temperature (°C)"
          />
          <Line type="monotone" dataKey="humidity" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }} name="Humidity (%)" />
          <Line
            type="monotone"
            dataKey="soilMoisture"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            name="Soil Moisture (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensorChart;
