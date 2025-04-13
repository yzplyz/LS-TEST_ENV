
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Crown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Get started with basic location scouting",
    features: [
      "5 searches per week",
      "Basic location details",
      "Copy coordinates",
      "Share locations",
    ],
    limitations: [
      "No Street View access",
      "Cannot save locations",
      "Limited search results",
    ],
    buttonText: "Current Plan",
    isPopular: false,
  },
  {
    name: "LocScout+",
    price: "$12",
    period: "per month",
    description: "Perfect for photographers and filmmakers",
    features: [
      "100 searches per month",
      "Full Street View access",
      "Save up to 50 locations",
      "Detailed location insights",
      "Priority support",
    ],
    buttonText: "Upgrade to LocScout+",
    isPopular: true,
  },
  {
    name: "LocScout Pro",
    price: "$25",
    period: "per month",
    description: "For professional production teams",
    features: [
      "Unlimited searches",
      "Full Street View access",
      "Unlimited saved locations",
      "Team collaboration",
      "API access",
      "24/7 priority support",
    ],
    buttonText: "Coming Soon",
    isPopular: false,
  },
];

export function PricingPlans() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBack = () => {
    navigate("/search");
  };

  const handleComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "Premium plans will be available shortly. Stay tuned!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Choose Your Plan</h2>
              <p className="text-sm text-muted-foreground">
                Select the perfect plan for your needs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: index * 0.1 }
              }}
              className={`relative rounded-xl border bg-card p-6 flex flex-col ${
                plan.isPopular ? "border-primary shadow-lg" : ""
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  )}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>

                <div className="space-y-2">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations?.map((limitation) => (
                    <div key={limitation} className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-4 w-4 relative">
                        <div className="absolute inset-0 border-2 border-muted-foreground rounded-full" />
                      </div>
                      <span className="text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  className="w-full"
                  variant={plan.name === "Free" ? "outline" : "default"}
                  disabled={plan.name === "Free" || plan.name === "LocScout Pro"}
                  onClick={() => {
                    if (plan.name === "LocScout Pro") {
                      handleComingSoon();
                    } else if (plan.name === "LocScout+") {
                      // Handle upgrade process
                      toast({
                        title: "Upgrade Process",
                        description: "Starting upgrade to LocScout+",
                      });
                    }
                  }}
                >
                  {plan.name === "Free" ? (
                    plan.buttonText
                  ) : (
                    <span className="flex items-center gap-2">
                      {plan.buttonText}
                      <Crown className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
