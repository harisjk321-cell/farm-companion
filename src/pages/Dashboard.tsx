import { Card } from "@/components/ui/card";
import { Bot, Leaf, Cloud, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-farm.jpg";

const Dashboard = () => {
  const botStatus = [
    { name: "Scout Robot", status: "operational", health: 95, lastActive: "2 mins ago" },
  ];

  const quickStats = [
    { icon: Leaf, label: "Healthy Plants", value: "2", color: "text-success" },
    { icon: AlertTriangle, label: "Need Attention", value: "0", color: "text-warning" },
    { icon: Activity, label: "Active Sensors", value: "5", color: "text-info" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img 
          src={heroImage} 
          alt="Modern farming with technology" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold text-primary-foreground mb-4">
              Welcome to GROOT
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl">
              Your intelligent farm management system. Monitor your robots, track plant health, 
              and optimize your farming operations with real-time data.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat) => (
            <Card key={stat.label} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-12 h-12 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Bot Health Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              Robot Fleet Status
            </h2>
            <Link to="/bot-health" className="text-primary hover:underline">
              View Details →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {botStatus.map((bot) => (
              <Card key={bot.name} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{bot.name}</h3>
                    <p className="text-sm text-muted-foreground">Last active: {bot.lastActive}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Health</span>
                    <span className="text-sm font-bold">{bot.health}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-success h-2 rounded-full transition-all"
                      style={{ width: `${bot.health}%` }}
                    />
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm">
                    <span className="font-medium">Status:</span>{" "}
                    <span className="text-success capitalize">{bot.status}</span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/plant-health">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-card">
              <Leaf className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Plant Health</h3>
              <p className="text-sm text-muted-foreground">Monitor crop conditions</p>
            </Card>
          </Link>
          
          <Link to="/sensor-data">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-card">
              <Cloud className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Weather Data</h3>
              <p className="text-sm text-muted-foreground">Real-time conditions</p>
            </Card>
          </Link>
          
          <Link to="/forum">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-card">
              <Activity className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Community</h3>
              <p className="text-sm text-muted-foreground">Share ideas & tips</p>
            </Card>
          </Link>
          
          <Link to="/chatbot">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-card">
              <Bot className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">GROOT AI</h3>
              <p className="text-sm text-muted-foreground">Ask farming questions</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;