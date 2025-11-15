import { Card } from "@/components/ui/card";
import { Bot, Battery, MapPin, Activity, Clock } from "lucide-react";

const BotHealth = () => {
  const robots = [
    {
      id: 1,
      name: "Scout Robot Alpha",
      type: "Scout",
      status: "operational",
      battery: 95,
      location: "Field A - Sector 3",
      lastMaintenance: "2 days ago",
      tasksCompleted: 847,
      activeTime: "6.5 hours",
      metrics: [
        { label: "Distance Covered", value: "12.4 km" },
        { label: "Plants Scanned", value: "1,247" },
        { label: "Issues Detected", value: "23" },
      ]
    },
    {
      id: 2,
      name: "Weeder Robot Beta",
      type: "Weeder",
      status: "operational",
      battery: 88,
      location: "Field B - Sector 1",
      lastMaintenance: "5 days ago",
      tasksCompleted: 623,
      activeTime: "5.2 hours",
      metrics: [
        { label: "Area Cleared", value: "8.7 hectares" },
        { label: "Weeds Removed", value: "3,456" },
        { label: "Efficiency", value: "94%" },
      ]
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Bot className="w-10 h-10 text-primary" />
          Robot Fleet Health
        </h1>
        <p className="text-muted-foreground">
          Monitor and manage your autonomous farming robots
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {robots.map((robot) => (
          <Card key={robot.id} className="p-6">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{robot.name}</h2>
                  <p className="text-sm text-muted-foreground">{robot.type} Robot</p>
                </div>
                <div className="flex items-center gap-2 bg-success/10 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-success capitalize">
                    {robot.status}
                  </span>
                </div>
              </div>

              {/* Battery */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Battery Level</span>
                  </div>
                  <span className="text-sm font-bold">{robot.battery}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      robot.battery > 80 ? 'bg-success' : 
                      robot.battery > 50 ? 'bg-warning' : 'bg-destructive'
                    }`}
                    style={{ width: `${robot.battery}%` }}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  <span className="font-medium">Current Location:</span> {robot.location}
                </span>
              </div>

              {/* Last Maintenance */}
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  <span className="font-medium">Last Maintenance:</span> {robot.lastMaintenance}
                </span>
              </div>

              {/* Active Time */}
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  <span className="font-medium">Active Today:</span> {robot.activeTime}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="border-t border-border pt-4">
              <h3 className="font-semibold mb-3">Performance Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                {robot.metrics.map((metric) => (
                  <div key={metric.label} className="text-center">
                    <p className="text-2xl font-bold text-primary">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-center">
                  <span className="font-bold text-primary">{robot.tasksCompleted}</span> total tasks completed
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BotHealth;