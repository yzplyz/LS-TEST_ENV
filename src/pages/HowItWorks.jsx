
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MainNav } from "@/components/layout/MainNav";
import { Camera, Map, Crown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HowItWorks() {
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: Search,
      title: "Describe Your Vision",
      description: "Tell us what kind of location you're looking for - whether it's an industrial warehouse, a nostalgic gas station, or a rustic outdoor setting."
    },
    {
      icon: Map,
      title: "Browse Locations",
      description: "Get instant access to locations within 100 miles of you, complete with street view images and exact coordinates."
    },
    {
      icon: Camera,
      title: "Scout Your Spot",
      description: "Use our detailed location information and street view integration to evaluate the perfect spot for your shoot."
    },
    {
      icon: Crown,
      title: "Unlock More Features",
      description: "Upgrade for additional searches, saved locations, and a wider search radius.",
      action: (
        <Button 
          onClick={() => navigate("/pricing")}
          className="mt-4"
        >
          View Plans
        </Button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-bold mb-4">How LocScout Works</h1>
            <p className="text-lg text-muted-foreground">
              Find the perfect location for your next photo or film shoot in just a few steps
            </p>
          </motion.div>

          <div className="grid gap-8 mt-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-start gap-6 p-6 rounded-lg border bg-card"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  <step.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                  {step.action}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
