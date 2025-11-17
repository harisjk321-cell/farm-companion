import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Camera, RefreshCw } from 'lucide-react';

const CAMERA_URL = "http://10.219.139.36/";
const CHECK_INTERVAL = 7000; // 7 seconds
const ANALYSIS_COOLDOWN = 30000; // 30 seconds

interface PlantAnalysis {
  species: { name: string; confidence: string };
  weeds_present: { value: boolean; confidence: string; notes: string };
  growth_level: string;
  pest_level: string;
  diseases_visible: { value: boolean; confidence: string; notes: string[] };
  estimated_NPK: { nitrogen: string; phosphorous: string; potassium: string; confidence: string };
  explanations: string;
}

const CameraMonitor = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const fetchCameraImage = async () => {
    try {
      const response = await fetch(CAMERA_URL, { 
        mode: 'cors',
        cache: 'no-cache'
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      return blob;
    } catch (error) {
      console.error('Error fetching camera image:', error);
      return null;
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const analyzeImage = async (blob: Blob) => {
    const now = Date.now();
    if (now - lastAnalysisTime < ANALYSIS_COOLDOWN) {
      return;
    }

    setIsAnalyzing(true);
    try {
      const base64 = await blobToBase64(blob);

      // Quick check first
      const quickCheck = await supabase.functions.invoke('esp32-plant-analysis', {
        body: { imageBase64: base64, analysisType: 'quick' }
      });

      if (quickCheck.error) throw quickCheck.error;

      const quickResult = quickCheck.data?.analysis;
      
      if (quickResult?.is_plant && parseFloat(quickResult.confidence) >= 80) {
        // Full analysis
        const fullAnalysis = await supabase.functions.invoke('esp32-plant-analysis', {
          body: { imageBase64: base64, analysisType: 'full' }
        });

        if (fullAnalysis.error) throw fullAnalysis.error;

        setAnalysis(fullAnalysis.data?.analysis);
        setLastAnalysisTime(now);
        
        toast({
          title: "Analysis Complete",
          description: "Plant detected and analyzed successfully",
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze image",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startMonitoring = async () => {
    setIsMonitoring(true);
    
    // Initial fetch
    const blob = await fetchCameraImage();
    if (blob) await analyzeImage(blob);

    // Set up interval
    intervalRef.current = setInterval(async () => {
      const blob = await fetchCameraImage();
      if (blob) await analyzeImage(blob);
    }, CHECK_INTERVAL);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const getHealthColor = (level: string) => {
    const num = parseFloat(level);
    if (num >= 80) return 'text-green-500';
    if (num >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Camera className="h-8 w-8" />
            ESP32 Camera Monitor
          </h1>
          <p className="text-muted-foreground mt-1">Live plant health analysis from your ESP32 camera</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            variant={isMonitoring ? "secondary" : "default"}
          >
            {isMonitoring ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Stop Monitoring
              </>
            ) : (
              'Start Monitoring'
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Live Camera Feed</CardTitle>
            <CardDescription>Real-time view from ESP32-CAM</CardDescription>
          </CardHeader>
          <CardContent>
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="ESP32 Camera Feed" 
                className="w-full rounded-lg border"
              />
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
            {isAnalyzing && (
              <div className="flex items-center justify-center mt-4">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-sm">Analyzing image...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle>Plant Analysis</CardTitle>
              <CardDescription>AI-powered diagnostics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Species */}
              <div>
                <h3 className="font-semibold mb-2">Species Identified</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{analysis.species.name}</span>
                  <Badge variant="outline">{analysis.species.confidence}% confidence</Badge>
                </div>
              </div>

              {/* Health Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Growth Level</p>
                  <p className={`text-2xl font-bold ${getHealthColor(analysis.growth_level)}`}>
                    {analysis.growth_level}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pest Level</p>
                  <p className={`text-2xl font-bold ${getHealthColor(String(100 - parseFloat(analysis.pest_level)))}`}>
                    {analysis.pest_level}%
                  </p>
                </div>
              </div>

              {/* Weeds */}
              <div>
                <h3 className="font-semibold mb-2">Weeds</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={analysis.weeds_present.value ? "destructive" : "secondary"}>
                    {analysis.weeds_present.value ? 'Detected' : 'None'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {analysis.weeds_present.confidence}% confidence
                  </span>
                </div>
                {analysis.weeds_present.notes && (
                  <p className="text-sm mt-1">{analysis.weeds_present.notes}</p>
                )}
              </div>

              {/* Diseases */}
              <div>
                <h3 className="font-semibold mb-2">Disease Detection</h3>
                <Badge variant={analysis.diseases_visible.value ? "destructive" : "secondary"}>
                  {analysis.diseases_visible.value ? 'Issues Found' : 'Healthy'}
                </Badge>
                {analysis.diseases_visible.notes.length > 0 && (
                  <ul className="text-sm mt-2 space-y-1">
                    {analysis.diseases_visible.notes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-500">•</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* NPK Estimates */}
              <div>
                <h3 className="font-semibold mb-2">Estimated NPK Levels</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-muted-foreground">N</p>
                    <p className="font-semibold">{analysis.estimated_NPK.nitrogen}</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-muted-foreground">P</p>
                    <p className="font-semibold">{analysis.estimated_NPK.phosphorous}</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-muted-foreground">K</p>
                    <p className="font-semibold">{analysis.estimated_NPK.potassium}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {analysis.estimated_NPK.confidence}% confidence
                </p>
              </div>

              {/* Summary */}
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Analysis Summary</h3>
                <p className="text-sm text-muted-foreground">{analysis.explanations}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CameraMonitor;
