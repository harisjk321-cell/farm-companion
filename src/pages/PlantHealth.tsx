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
          <div className="space-y-6">
            {/* Overall Status Banner */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 border-2 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                  <StatusIcon className={`relative w-16 h-16 ${healthStatus.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium mb-1">Overall Farm Status</p>
                  <p className={`text-4xl font-bold ${healthStatus.color}`}>
                    {healthStatus.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Sensor Status Visualizations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 border-l-4 border-l-primary">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Air Quality</span>
                  <span className="text-lg font-bold">{sensorData.aqi}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-success to-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (parseInt(sensorData.aqi) / 50) * 100)}%` }}
                  />
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-info">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Soil Moisture Avg</span>
                  <span className="text-lg font-bold">
                    {((parseFloat(sensorData.soilPlot1) + parseFloat(sensorData.soilPlot2)) / 2).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-info to-primary h-2 rounded-full transition-all"
                    style={{ width: `${((parseFloat(sensorData.soilPlot1) + parseFloat(sensorData.soilPlot2)) / 2)}%` }}
                  />
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-warning">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">pH Level</span>
                  <span className="text-lg font-bold">{sensorData.ph}</span>
                </div>
                <div className="flex gap-1 h-2">
                  {[...Array(14)].map((_, i) => (
                    <div 
                      key={i}
                      className={`flex-1 rounded-sm transition-all ${
                        Math.abs(i - parseFloat(sensorData.ph)) < 0.5 
                          ? 'bg-warning' 
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>7</span>
                  <span>14</span>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-success">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Water Temp</span>
                  <span className="text-lg font-bold">{sensorData.waterTemp}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-info via-success to-warning h-2 rounded-full transition-all"
                    style={{ width: `${(parseFloat(sensorData.waterTemp) / 40) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0°C</span>
                  <span>40°C</span>
                </div>
              </Card>
            </div>

            {/* AI Analysis Text */}
            <Card className="p-6 bg-muted/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                Detailed Analysis & Recommendations
              </h3>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {analysis}
                </div>
              </div>
            </Card>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={analyzeHealth} 
                variant="outline"
                className="gap-2"
                disabled={analyzing}
              >
                <RefreshCw className="w-4 h-4" />
                Run New Analysis
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <Leaf className="relative w-20 h-20 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Ready to Analyze</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Click "Analyze Plant Health" to get AI-powered insights and recommendations 
              based on your current sensor data.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
              <span className="px-3 py-1 bg-muted rounded-full">✓ Real-time Data</span>
              <span className="px-3 py-1 bg-muted rounded-full">✓ AI-Powered</span>
              <span className="px-3 py-1 bg-muted rounded-full">✓ Actionable Insights</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PlantHealth;