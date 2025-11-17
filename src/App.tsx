import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import BotHealth from "./pages/BotHealth";
import PlantHealth from "./pages/PlantHealth";
import SensorData from "./pages/SensorData";
import WebcamMonitor from "./pages/WebcamMonitor";
import ESP32Control from "./pages/ESP32Control";
import Learn from "./pages/Learn";
import Forum from "./pages/Forum";
import Chatbot from "./pages/Chatbot";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bot-health" element={<BotHealth />} />
            <Route path="/plant-health" element={<PlantHealth />} />
            <Route path="/sensor-data" element={<SensorData />} />
            <Route path="/webcam-monitor" element={<WebcamMonitor />} />
            <Route path="/esp32-control" element={<ESP32Control />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;