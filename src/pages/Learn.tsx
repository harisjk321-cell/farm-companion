import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Droplets, Brain, Leaf, Sun, Bug, TrendingUp, Zap } from "lucide-react";

const Learn = () => {
  const learningCards = [
    {
      icon: Brain,
      title: "Soil Microbiome Power",
      description: "Did you know? Healthy soil contains more microorganisms than there are people on Earth! A teaspoon of soil has 1 billion bacteria. Maintaining pH between 6.0-7.0 optimizes microbial activity, increasing nutrient availability by up to 40%.",
      color: "text-amber-500"
    },
    {
      icon: Droplets,
      title: "Water at the Right Time",
      description: "Most farmers don't know: Watering crops in early morning (4-6 AM) reduces water loss by 25-30% compared to midday. Plants absorb 70% more nutrients when soil moisture is at 60-70% capacity rather than fully saturated.",
      color: "text-blue-500"
    },
    {
      icon: Sun,
      title: "Temperature Swing Strategy",
      description: "Secret tip: A 10°C difference between day and night temperatures can increase fruit sugar content by 15-20%. Monitor weather patterns to time harvest for peak sweetness and longer shelf life.",
      color: "text-orange-500"
    },
    {
      icon: Leaf,
      title: "Companion Planting Science",
      description: "Lesser-known fact: Planting marigolds near tomatoes reduces nematode populations by 90%. Basil near peppers increases yield by 20% through natural pest deterrence and improved pollination.",
      color: "text-green-500"
    },
    {
      icon: Bug,
      title: "Integrated Pest Management",
      description: "Smart farmers know: Introducing beneficial insects like ladybugs (1 per plant) can eliminate 95% of aphids naturally. This costs 80% less than chemical sprays and improves soil health long-term.",
      color: "text-red-500"
    },
    {
      icon: TrendingUp,
      title: "Sensor-Based Precision",
      description: "Data reveals: Farms using real-time sensor monitoring reduce fertilizer use by 30% while increasing yields by 15-25%. pH sensors prevent nutrient lockout, saving thousands in wasted inputs.",
      color: "text-purple-500"
    },
    {
      icon: Zap,
      title: "Electro-Culture Technique",
      description: "Emerging science: Weak electrical currents in soil can accelerate seed germination by 40% and boost growth rates by 20-30%. This ancient technique is being rediscovered with modern sensors.",
      color: "text-cyan-500"
    },
    {
      icon: Droplets,
      title: "Mulching Magic",
      description: "Often overlooked: 3-inch organic mulch layer reduces water evaporation by 70%, suppresses weeds by 85%, and increases soil temperature stability. This alone can cut water usage in half during summer.",
      color: "text-teal-500"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-primary" />
          Smart Farming Insights
        </h1>
        <p className="text-muted-foreground">
          Advanced techniques and lesser-known facts that can transform your farm's productivity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Icon className={`w-6 h-6 ${card.color}`} />
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <TrendingUp className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Pro Tip: Combine These Strategies</h3>
              <p className="text-muted-foreground">
                Farms that implement 3 or more of these techniques see an average yield increase of 35-50% 
                while reducing input costs by 25-40%. Start with sensor monitoring and proper watering schedules 
                for the biggest immediate impact.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Learn;