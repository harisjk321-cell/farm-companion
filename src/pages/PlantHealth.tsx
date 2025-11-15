import { Card } from "@/components/ui/card";
import { Leaf, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const PlantHealth = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Leaf className="w-10 h-10 text-primary" />
          Plant Health Monitoring
        </h1>
        <p className="text-muted-foreground">
          Real-time health data from your crops and fields
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Healthy Plants</h3>
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
          <p className="text-4xl font-bold mb-1">1,247</p>
          <p className="text-sm text-success flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +5% from last week
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Need Attention</h3>
            <AlertTriangle className="w-6 h-6 text-warning" />
          </div>
          <p className="text-4xl font-bold mb-1">23</p>
          <p className="text-sm text-muted-foreground">
            Across 3 sectors
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Growth Rate</h3>
            <TrendingUp className="w-6 h-6 text-info" />
          </div>
          <p className="text-4xl font-bold mb-1">94%</p>
          <p className="text-sm text-success">
            Optimal conditions
          </p>
        </Card>
      </div>

      {/* Data Display Area */}
      <Card className="p-8">
        <div className="text-center py-12">
          <Leaf className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Plant Health Data</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Detailed plant health metrics, growth patterns, and disease detection data will be displayed here. 
            Connect your sensors and monitoring systems to view real-time information.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PlantHealth;