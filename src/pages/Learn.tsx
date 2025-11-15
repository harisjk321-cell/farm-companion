import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const Learn = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-primary" />
          Learning Resources
        </h1>
        <p className="text-muted-foreground">
          Educational content, guides, and farming best practices
        </p>
      </div>

      <Card className="p-8">
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            This section will contain articles, tutorials, videos, and guides about sustainable farming, 
            technology integration, crop management, and more. Stay tuned for updates!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Learn;