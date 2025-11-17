import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Camera, Video, VideoOff } from 'lucide-react';

const CHECK_INTERVAL = 5000; // 5 seconds
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

const WebcamMonitor = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        
        toast({
          title: "Webcam Started",
          description: "Live plant monitoring active",
        });

        // Start analysis loop
        intervalRef.current = setInterval(captureAndAnalyze, CHECK_INTERVAL);
      }
    } catch (error) {
      console.error('Webcam access error:', error);
      toast({
        title: "Webcam Access Failed",
        description: "Please allow camera access in your browser",
        variant: "destructive",
      });
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
  };

  const captureAndAnalyze = async () => {
    const now = Date.now();
    if (now - lastAnalysisTime < ANALYSIS_COOLDOWN) {
      return;
    }

    const imageBase64 = captureFrame();
    if (!imageBase64) return;

    setIsAnalyzing(true);
    try {
      // Quick check first
      const quickCheck = await supabase.functions.invoke('esp32-plant-analysis', {
        body: { imageBase64, analysisType: 'quick' }
      });

      if (quickCheck.error) throw quickCheck.error;

      const quickResult = quickCheck.data?.analysis;
      
      if (quickResult?.is_plant && parseFloat(quickResult.confidence) >= 80) {
        // Full analysis
        const fullAnalysis = await supabase.functions.invoke('esp32-plant-analysis', {
          body: { imageBase64, analysisType: 'full' }
        });

        if (fullAnalysis.error) throw fullAnalysis.error;

        setAnalysis(fullAnalysis.data?.analysis);
        setLastAnalysisTime(now);
        
        toast({
          title: "Plant Detected",
          description: "Analysis complete",
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

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
            <Video className="h-8 w-8" />
            Webcam Plant Monitor
          </h1>
          <p className="text-muted-foreground mt-1">Live plant health analysis from your webcam</p>
        </div>
        <Button
          onClick={isStreaming ? stopWebcam : startWebcam}
          variant={isStreaming ? "secondary" : "default"}
        >
          {isStreaming ? (
            <>
              <VideoOff className="mr-2 h-4 w-4" />
              Stop Webcam
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Start Webcam
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Live Webcam Feed</CardTitle>
            <CardDescription>Real-time view from your camera</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <video 
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg border"
                style={{ display: isStreaming ? 'block' : 'none' }}
              />
              {!isStreaming && (
                <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                  <p className="text-muted-foreground">Webcam not active</p>
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            {isAnalyzing && (
              <div className="flex items-center justify-center mt-4">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-sm">Analyzing frame...</span>
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

export default WebcamMonitor;
