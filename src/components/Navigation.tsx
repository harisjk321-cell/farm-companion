import { NavLink } from "react-router-dom";
import { Bot, Leaf, Cloud, BookOpen, Users, MessageSquare, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const navItems = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/bot-health", icon: Bot, label: "Bot Health" },
    { to: "/plant-health", icon: Leaf, label: "Plant Health" },
    { to: "/sensor-data", icon: Cloud, label: "Sensors & Weather" },
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
          
          <div className="flex space-x-1">
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
        </div>
      </div>
    </nav>
  );
};

export default Navigation;