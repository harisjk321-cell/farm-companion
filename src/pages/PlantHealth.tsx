import { Card } from "@/components/ui/card";
import { Leaf, AlertTriangle, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const PlantHealth = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>("");
  
  const [sensorData, setSensorData] = useState({
    aqi: "Loading...",
    soilPlot1: "Loading...",
    soilPlot2: "Loading...",
    ph: "Loading...",
    turbidity: "Loading...",
    waterTemp: "Loading...",
  });

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSensorData = async () => {
    setLoading(true);
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
      toast({
        title: "Error",
        description: "Failed to fetch sensor data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeHealth = async () => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-plant-health', {
        body: { sensorData },
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your sensor data",
      });
    } catch (error) {
      console.error('Error analyzing plant health:', error);
      toast({
        title: "Error",
        description: "Failed to analyze plant health",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getHealthStatus = () => {
    if (analysis.toLowerCase().includes('critical')) return { status: 'Critical', color: 'text-destructive', icon: AlertTriangle };
    if (analysis.toLowerCase().includes('attention')) return { status: 'Needs Attention', color: 'text-warning', icon: AlertTriangle };
    if (analysis.toLowerCase().includes('healthy')) return { status: 'Healthy', color: 'text-success', icon: CheckCircle };
    return { status: 'Unknown', color: 'text-muted-foreground', icon: Leaf };
  };

  const healthStatus = getHealthStatus();
  const StatusIcon = healthStatus.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Leaf className="w-10 h-10 text-primary" />
          Plant Health Monitoring
        </h1>
        <p className="text-muted-foreground">
          AI-powered analysis using real-time sensor data
        </p>
      </div>

      {/* Current Sensor Data */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Current Sensor Readings</h2>
          <Button 
            onClick={fetchSensorData} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">AQI</p>
            <p className="text-2xl font-bold">{sensorData.aqi}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Soil Plot 1</p>
            <p className="text-2xl font-bold">{sensorData.soilPlot1}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Soil Plot 2</p>
            <p className="text-2xl font-bold">{sensorData.soilPlot2}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">pH Level</p>
            <p className="text-2xl font-bold">{sensorData.ph}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Turbidity</p>
            <p className="text-2xl font-bold">{sensorData.turbidity}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Water Temp</p>
            <p className="text-2xl font-bold">{sensorData.waterTemp}</p>
          </Card>
        </div>
      </div>

      {/* AI Analysis Section */}
      <Card className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">AI Health Analysis</h2>
          <Button 
            onClick={analyzeHealth} 
            disabled={analyzing || loading}
            className="gap-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Leaf className="w-4 h-4" />
                Analyze Plant Health
              </>
            )}
          </Button>
        </div>

        {analysis ? (
          <div>
            <div className="flex items-center gap-3 mb-6 p-4 bg-muted rounded-lg">
              <StatusIcon className={`w-8 h-8 ${healthStatus.color}`} />
              <div>
                <p className="text-sm text-muted-foreground">Overall Status</p>
                <p className={`text-2xl font-bold ${healthStatus.color}`}>
                  {healthStatus.status}
                </p>
              </div>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-foreground">
                {analysis}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Leaf className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Click "Analyze Plant Health" to get AI-powered insights and recommendations 
              based on your current sensor data.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PlantHealth;