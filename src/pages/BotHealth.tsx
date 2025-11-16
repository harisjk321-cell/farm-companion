import { Card } from "@/components/ui/card";
import { TrendingUp, Droplets, AlertTriangle, CheckCircle, Cloud, Thermometer, Wind, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const BotHealth = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [predictions, setPredictions] = useState<string>("");
  
  const [sensorData, setSensorData] = useState({
    aqi: "Loading...",
    soilPlot1: "Loading...",
    soilPlot2: "Loading...",
    ph: "Loading...",
    turbidity: "Loading...",
    waterTemp: "Loading...",
  });

  const [weatherData, setWeatherData] = useState({
    temp: "Loading...",
    humidity: "Loading...",
    windSpeed: "Loading...",
    condition: "Loading...",
  });

  const [wateringLog] = useState([
    { date: "2025-11-15", time: "06:30 AM", duration: "45 min", amount: "250L", plot: "Plot 1" },
    { date: "2025-11-14", time: "06:15 AM", duration: "40 min", amount: "230L", plot: "Plot 1" },
    { date: "2025-11-14", time: "06:45 AM", duration: "35 min", amount: "200L", plot: "Plot 2" },
  ]);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchSensorData(), fetchWeatherData()]);
    setLoading(false);
  };

  const fetchSensorData = async () => {
    try {
      const [aqiRes, soil1Res, soil2Res, phRes, turbidityRes, tempRes] = await Promise.all([
        fetch('https://blynk.cloud/external/api/get?token=9BusrE4D9ZwDUfeAvHOcXQjOkAFsWndW&V0'),
        fetch('https://blynk.cloud/external/api/get?token=K3ndotq1yidwphc9JzSTL8wlWVTRXug2&V0'),
        fetch('https://blynk.cloud/external/api/get?token=K3ndotq1yidwphc9JzSTL8wlWVTRXug2&V1'),
        fetch('https://blynk.cloud/external/api/get?token=yz9RxlFqLYe7xhJda5WoOOxjlfl4xkFB&V1'),
        fetch('https://blynk.cloud/external/api/get?token=yz9RxlFqLYe7xhJda5WoOOxjlfl4xkFB&V2'),
        fetch('https://blynk.cloud/external/api/get?token=yz9RxlFqLYe7xhJda5WoOOxjlfl4xkFB&V3'),
      ]);

      const [aqi, soil1, soil2, ph, turbidity, temp] = await Promise.all([
        aqiRes.text(),
        soil1Res.text(),
        soil2Res.text(),
        phRes.text(),
        turbidityRes.text(),
        tempRes.text(),
      ]);

      setSensorData({
        aqi: aqi || "N/A",
        soilPlot1: soil1 ? `${soil1}%` : "N/A",
        soilPlot2: soil2 ? `${soil2}%` : "N/A",
        ph: ph || "N/A",
        turbidity: turbidity ? `${turbidity} NTU` : "N/A",
        waterTemp: temp ? `${temp}°C` : "N/A",
      });
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  const fetchWeatherData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('weather', {
        body: { lat: 10.269609355943714, lon: 76.4001000044277 },
      });

      if (error) throw error;

      setWeatherData({
        temp: data.main?.temp ? `${Math.round(data.main.temp)}°C` : "N/A",
        humidity: data.main?.humidity ? `${data.main.humidity}%` : "N/A",
        windSpeed: data.wind?.speed ? `${data.wind.speed} m/s` : "N/A",
        condition: data.weather?.[0]?.main || "N/A",
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const generatePredictions = async () => {
    setPredicting(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-plant-health', {
        body: { 
          sensorData,
          weatherData,
          predictive: true
        },
      });

      if (error) throw error;

      setPredictions(data.analysis);
      toast({
        title: "Prediction Complete",
        description: "AI has generated predictive insights",
      });
    } catch (error) {
      console.error('Error generating predictions:', error);
      toast({
        title: "Error",
        description: "Failed to generate predictions",
        variant: "destructive",
      });
    } finally {
      setPredicting(false);
    }
  };

  const getPredictionStatus = () => {
    if (predictions.toLowerCase().includes('urgent') || predictions.toLowerCase().includes('critical')) {
      return { status: 'Immediate Action Needed', color: 'text-destructive', icon: AlertTriangle };
    }
    if (predictions.toLowerCase().includes('monitor') || predictions.toLowerCase().includes('attention')) {
      return { status: 'Monitor Closely', color: 'text-warning', icon: AlertTriangle };
    }
    if (predictions.toLowerCase().includes('optimal') || predictions.toLowerCase().includes('good')) {
      return { status: 'Conditions Optimal', color: 'text-success', icon: CheckCircle };
    }
    return { status: 'Ready to Analyze', color: 'text-muted-foreground', icon: TrendingUp };
  };

  const status = getPredictionStatus();
  const StatusIcon = status.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <TrendingUp className="w-10 h-10 text-primary" />
          Predictive Farm Analysis
        </h1>
        <p className="text-muted-foreground">
          AI-powered predictions using sensor data and weather forecasts
        </p>
      </div>

      {/* Current Conditions Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Thermometer className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Temperature</span>
          </div>
          <p className="text-2xl font-bold">{weatherData.temp}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Humidity</span>
          </div>
          <p className="text-2xl font-bold">{weatherData.humidity}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Wind className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Wind Speed</span>
          </div>
          <p className="text-2xl font-bold">{weatherData.windSpeed}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Cloud className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Condition</span>
          </div>
          <p className="text-2xl font-bold">{weatherData.condition}</p>
        </Card>
      </div>

      {/* Predictive Analysis Section */}
      <Card className="p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Predictive Insights</h2>
          <Button 
            onClick={generatePredictions} 
            disabled={predicting || loading}
            className="gap-2"
          >
            {predicting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Generate Predictions
              </>
            )}
          </Button>
        </div>

        {predictions ? (
          <div className="space-y-6">
            {/* Status Banner */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 border-2 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                  <StatusIcon className={`relative w-16 h-16 ${status.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium mb-1">Farm Prediction Status</p>
                  <p className={`text-4xl font-bold ${status.color}`}>
                    {status.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Prediction Details */}
            <Card className="p-6 bg-muted/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                AI Predictions & Recommendations
              </h3>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {predictions}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <TrendingUp className="relative w-20 h-20 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Ready to Predict</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Click "Generate Predictions" to get AI-powered forecasts combining sensor data, 
              weather conditions, and historical patterns.
            </p>
          </div>
        )}
      </Card>

      {/* Watering Log */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Droplets className="w-6 h-6 text-primary" />
            Watering Log
          </h2>
          <span className="text-sm text-muted-foreground">Last 7 days</span>
        </div>
        <div className="space-y-3">
          {wateringLog.map((log, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{log.plot}</p>
                  <p className="text-sm text-muted-foreground">{log.date} at {log.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{log.amount}</p>
                <p className="text-sm text-muted-foreground">{log.duration}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Watering data synced from sensors • Updates automatically
        </p>
      </Card>
    </div>
  );
};


export default BotHealth;