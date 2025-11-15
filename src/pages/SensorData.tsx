import { Card } from "@/components/ui/card";
import { Cloud, Thermometer, Droplets, Wind, Sun } from "lucide-react";

const SensorData = () => {
  const weatherData = {
    temperature: "24°C",
    humidity: "65%",
    windSpeed: "12 km/h",
    rainfall: "0 mm",
    uvIndex: "6 (High)",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Cloud className="w-10 h-10 text-primary" />
          Sensor Data & Weather
        </h1>
        <p className="text-muted-foreground">
          Environmental monitoring and weather conditions
        </p>
      </div>

      {/* Current Weather */}
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
            <p className="text-sm text-muted-foreground mb-1">Rainfall</p>
            <p className="text-2xl font-bold">{weatherData.rainfall}</p>
          </Card>

          <Card className="p-6 text-center">
            <Sun className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">UV Index</p>
            <p className="text-2xl font-bold">{weatherData.uvIndex}</p>
          </Card>
        </div>
      </div>

      {/* Sensor Data Display */}
      <Card className="p-8">
        <div className="text-center py-12">
          <Cloud className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Sensor Network Data</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Soil moisture, pH levels, nutrient content, and other sensor readings from your field network 
            will be displayed here. Connect your IoT sensors to start monitoring.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SensorData;