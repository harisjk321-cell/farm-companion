import { Card } from "@/components/ui/card";
import { Droplets, Skull } from "lucide-react";

const BotHealth = () => {
  const wateringLog = [
    { date: "2025-11-15", time: "06:30 AM", duration: "45 min", amount: "250L", plot: "Plot 1" },
    { date: "2025-11-14", time: "06:15 AM", duration: "40 min", amount: "230L", plot: "Plot 1" },
    { date: "2025-11-14", time: "06:45 AM", duration: "35 min", amount: "200L", plot: "Plot 2" },
    { date: "2025-11-13", time: "06:20 AM", duration: "42 min", amount: "240L", plot: "Plot 1" },
    { date: "2025-11-13", time: "06:50 AM", duration: "38 min", amount: "210L", plot: "Plot 2" },
  ];

  const weedAcidLog = [
    { date: "2025-11-15", time: "08:45 AM", amount: "12L", concentration: "15%", area: "Field A - Section 2" },
    { date: "2025-11-13", time: "09:30 AM", amount: "10L", concentration: "15%", area: "Field B - Section 1" },
    { date: "2025-11-12", time: "08:15 AM", amount: "15L", concentration: "18%", area: "Field A - Section 3" },
    { date: "2025-11-11", time: "09:00 AM", amount: "11L", concentration: "15%", area: "Field B - Section 2" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Farm Activity Logs</h1>
        <p className="text-muted-foreground">Track watering and weed control operations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Droplets className="w-6 h-6 text-primary" />
              Watering Log
            </h2>
            <span className="text-sm text-muted-foreground">Last 7 days</span>
          </div>
          <div className="space-y-3">
            {wateringLog.map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-colors">
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
          <p className="text-xs text-muted-foreground mt-4 text-center">Watering data synced from sensors</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Skull className="w-6 h-6 text-warning" />
              Weed Acid Dispenser Log
            </h2>
            <span className="text-sm text-muted-foreground">Last 7 days</span>
          </div>
          <div className="space-y-3">
            {weedAcidLog.map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border hover:border-warning/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                    <Skull className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <p className="font-semibold">{log.area}</p>
                    <p className="text-sm text-muted-foreground">{log.date} at {log.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-warning">{log.amount}</p>
                  <p className="text-xs text-muted-foreground">{log.concentration} concentration</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">Dispenser data synced from sensors</p>
        </Card>
      </div>
    </div>
  );
};

export default BotHealth;
