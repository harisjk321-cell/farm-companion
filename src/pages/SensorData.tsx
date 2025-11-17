import { Card } from "@/components/ui/card";
import { Cloud, Thermometer, Droplets, Wind, Sun, Wind as WindIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SensorData = () => {
  const { toast } = useToast();
  const [weatherData, setWeatherData] = useState({
    temperature: "Loading...",
    humidity: "Loading...",
    windSpeed: "Loading...",
    condition: "Loading...",
    feelsLike: "Loading...",
  });

  const [sensorData, setSensorData] = useState({
    aqi: "Loading...",
    soilPlot1: "Loading...",
    soilPlot2: "Loading...",
    ph: "Loading...",
    turbidity: "Loading...",
  });

  useEffect(() => {
    fetchWeatherData();
    fetchSensorData();
    
    const weatherInterval = setInterval(fetchWeatherData, 300000); // Every 5 minutes
    const sensorInterval = setInterval(fetchSensorData, 30000); // Every 30 seconds
    
    return () => {
      clearInterval(weatherInterval);
      clearInterval(sensorInterval);
    };
  }, []);

  const fetchWeatherData = async () => {
    try {
      const lat = 10.269609355943714;
      const lon = 76.4001000044277;

      const { data, error } = await supabase.functions.invoke('weather', {
        body: { lat, lon },
      });

      if (error) throw new Error(error.message || 'Weather fetch failed');

      setWeatherData({
        temperature: `${Math.round((data as any).main.temp)}°C`,
        humidity: `${(data as any).main.humidity}%`,
        windSpeed: `${Math.round(((data as any).wind.speed || 0) * 3.6)} km/h`,
        condition: (data as any).weather?.[0]?.main || 'N/A',
        feelsLike: `${Math.round((data as any).main.feels_like)}°C`,
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch weather data",
        variant: "destructive",
      });
    }
  };

  const fetchSensorData = async () => {
    try {
      const [aqiRes, soil1Res, soil2Res, phRes, turbidityRes] = await Promise.all([
        fetch('https://blynk.cloud/external/api/get?token=9BusrE4D9ZwDUfeAvHOcXQjOkAFsWndW&V0'),
        fetch('https://blynk.cloud/external/api/get?token=K3ndotq1yidwphc9JzSTL8wlWVTRXug2&V0'),
        fetch('https://blynk.cloud/external/api/get?token=K3ndotq1yidwphc9JzSTL8wlWVTRXug2&V1'),
        fetch('https://blynk.cloud/external/api/get?token=yz9RxlFqLYe7xhJda5WoOOxjlfl4xkFB&V1'),
        fetch('https://blynk.cloud/external/api/get?token=yz9RxlFqLYe7xhJda5WoOOxjlfl4xkFB&V2'),
      ]);

      const [aqi, soil1, soil2, ph, turbidity] = await Promise.all([
        aqiRes.text(),
        soil1Res.text(),
        soil2Res.text(),
        phRes.text(),
        turbidityRes.text(),
      ]);

      setSensorData({
        aqi: aqi || "N/A",
        soilPlot1: soil1 ? `${soil1}%` : "N/A",
        soilPlot2: soil2 ? `${soil2}%` : "N/A",
        ph: ph || "N/A",
        turbidity: turbidity ? `${turbidity} NTU` : "N/A",
      });
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sensor data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Cloud className="w-10 h-10 text-primary" />
          Sensor Data & Weather
        </h1>
        <p className="text-muted-foreground">
          Real-time environmental monitoring and sensor data
        </p>
      </div>

      {/* Current Weather Conditions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Current Conditions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-6 text-center">
            <Thermometer className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Temperature</p>
            <p className="text-2xl font-bold">{weatherData.temperature}</p>
          </Card>

          <Card className="p-6 text-center">
            <Droplets className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Humidity</p>
            <p className="text-2xl font-bold">{weatherData.humidity}</p>
          </Card>

          <Card className="p-6 text-center">
            <Wind className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Wind Speed</p>
            <p className="text-2xl font-bold">{weatherData.windSpeed}</p>
          </Card>

          <Card className="p-6 text-center">
            <Cloud className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Weather</p>
            <p className="text-2xl font-bold">{weatherData.condition}</p>
          </Card>

          <Card className="p-6 text-center">
            <Sun className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Feels Like</p>
            <p className="text-2xl font-bold">{weatherData.feelsLike}</p>
          </Card>
        </div>
      </div>

      {/* Atmosphere & Ground Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          🌍 Atmosphere & Ground
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 text-center">
            <span className="text-4xl mb-3 block">💨</span>
            <p className="text-sm text-muted-foreground mb-1">Air Quality Index</p>
            <p className="text-2xl font-bold">{sensorData.aqi}</p>
          </Card>

          <Card className="p-6 text-center">
            <span className="text-4xl mb-3 block">💧</span>
            <p className="text-sm text-muted-foreground mb-1">Soil Dryness - Plot 1</p>
            <p className="text-2xl font-bold">{sensorData.soilPlot1}</p>
          </Card>

          <Card className="p-6 text-center">
            <span className="text-4xl mb-3 block">💧</span>
            <p className="text-sm text-muted-foreground mb-1">Soil Dryness - Plot 2</p>
            <p className="text-2xl font-bold">{sensorData.soilPlot2}</p>
          </Card>
        </div>
      </div>

      {/* Hydroponic System Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          🌱 Hydroponic System
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 text-center">
            <span className="text-4xl mb-3 block">⚗️</span>
            <p className="text-sm text-muted-foreground mb-1">pH Level</p>
            <p className="text-2xl font-bold">{sensorData.ph}</p>
          </Card>

          <Card className="p-6 text-center">
            <span className="text-4xl mb-3 block">🌊</span>
            <p className="text-sm text-muted-foreground mb-1">Turbidity</p>
            <p className="text-2xl font-bold">{sensorData.turbidity}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SensorData;