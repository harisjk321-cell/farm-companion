import { NavLink, useNavigate } from "react-router-dom";
import { Bot, Leaf, Cloud, BookOpen, Users, MessageSquare, Home, LogOut, LogIn, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

  const navItems = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/bot-health", icon: Bot, label: "Bot Health" },
    { to: "/plant-health", icon: Leaf, label: "Plant Health" },
    { to: "/sensor-data", icon: Cloud, label: "Sensors & Weather" },
    { to: "/camera-monitor", icon: Camera, label: "ESP32 Camera" },
    { to: "/webcam-monitor", icon: Camera, label: "Webcam Monitor" },
    { to: "/learn", icon: BookOpen, label: "Learn" },
    { to: "/forum", icon: Users, label: "Community" },
    { to: "/chatbot", icon: MessageSquare, label: "GROOT Chat" },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">GROOT</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1 mr-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
                      "hover:bg-muted text-muted-foreground hover:text-foreground",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden md:inline text-sm font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>

            {session ? (
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            ) : (
              <Button 
                onClick={() => navigate("/auth")} 
                variant="default" 
                size="sm"
                className="gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden md:inline">Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;