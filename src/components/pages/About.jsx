import React from "react";
import { motion } from "framer-motion";
import { MainNav } from "@/components/layout/MainNav";
import { Camera, Map, Users, Globe } from "lucide-react";

export function About() {
  const features = [
    {
      icon: Camera,
      title: "For Photographers",
      description: "Find unique locations for your next photoshoot."
    },
    {
      icon: Map,
      title: "For Filmmakers",
      description: "Discover perfect settings for your productions."
    },
    {
      icon: Users,
      title: "For Teams",
      description: "Collaborate with your crew on location scouting."
    },
    {
      icon: Globe,
      title: "Growing Network",
      description: "Access locations across multiple cities and regions."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">About LocScout</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're revolutionizing how creators find the perfect locations for their projects.
              Our platform connects photographers and filmmakers with unique spaces.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg border bg-card"
              >
                <feature.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              To empower creators by making location scouting efficient, 
              accessible, and inspiring. We believe every project deserves 
              the perfect setting, and we're here to help you find it.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}