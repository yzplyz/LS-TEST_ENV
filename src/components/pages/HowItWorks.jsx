import React from "react";
import { motion } from "framer-motion";
import { MainNav } from "@/components/layout/MainNav";
import { Search, Map, Crown, Camera } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Describe Your Vision",
      description: "Tell us what kind of location you're looking for using natural language."
    },
    {
      icon: Map,
      title: "Browse Locations",
      description: "Explore curated locations within your area that match your criteria."
    },
    {
      icon: Camera,
      title: "Preview and Save",
      description: "View detailed information, street views, and save your favorite spots."
    },
    {
      icon: Crown,
      title: "Unlock More",
      description: "Upgrade to access premium features like unlimited searches and saved locations."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">How LocScout Works</h1>
            <p className="text-muted-foreground">
              Find the perfect location for your next photo or film shoot in just a few steps
            </p>
          </div>

          <div className="grid gap-8 mt-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-6 p-6 rounded-lg border bg-card"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}