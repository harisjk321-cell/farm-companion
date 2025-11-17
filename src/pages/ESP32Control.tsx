import { Card } from "@/components/ui/card";
import { Cpu, Wrench } from "lucide-react";

const ESP32Control = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Cpu className="w-10 h-10 text-primary" />
          ESP32 Control Center
        </h1>
        <p className="text-muted-foreground">
          Direct control and monitoring of ESP32 devices
        </p>
      </div>

      {/* Under Construction Card */}
      <Card className="p-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-6">
            <Wrench className="w-24 h-24 text-primary mx-auto animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Under Construction</h2>
          <p className="text-lg text-muted-foreground mb-6">
            We're building something amazing! The ESP32 Control Center will allow you to:
          </p>
          <ul className="text-left space-y-3 mb-8">
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Direct control of ESP32 devices</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Real-time device status monitoring</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Configure device settings remotely</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>View device logs and diagnostics</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Firmware update management</span>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Check back soon for updates!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ESP32Control;
