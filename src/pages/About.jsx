
import React from "react";
import { motion } from "framer-motion";
import { MainNav } from "@/components/layout/MainNav";
import { Camera, Users, Globe, Shield } from "lucide-react";

export function About() {
  const features = [
    {
      icon: Camera,
      title: "For Creators",
      content: "Built by photographers and filmmakers, for photographers and filmmakers. We understand the time and energy it takes to scout the perfect location."
    },
    {
      icon: Globe,
      title: "Location First",
      content: "Location scouting made simple. Our platform is dedicated to helping you find the perfect shooting locations faster and with less effort."
    },
    {
      icon: Users,
      title: "Community Driven",
      content: "Join a vibrant community of creators who are sharing, discovering, and curating unique shooting locations."
    },
    {
      icon: Shield,
      title: "Privacy Focused",
      content: "Your privacy is our priority. All your data and saved locations are secure, private, and under your control."
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
            <h1 className="text-3xl font-bold mb-4">About LocScout</h1>
            <p className="text-lg text-muted-foreground">
              Helping creators discover the perfect locations to bring their visions to life — quickly, easily, and with confidence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg border bg-card"
              >
                <feature.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.content}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                LocScout was born out of a simple observation: finding the perfect shooting location shouldn't be a struggle. As filmmakers and photographers ourselves, we've spent countless hours searching for the right places, often with little success.
              </p>
              <p>
                We created LocScout to streamline this process, making it easier for creators to find exactly what they're looking for. With advanced AI-powered search capabilities, detailed location information, and a growing community of like-minded creators, our platform helps you make informed decisions and unlock the perfect locations for your projects.
              </p>
              <p>
                Today, we're proud to serve a community of creators who trust LocScout to help them bring their creative visions to life—whether it's for their next photo shoot, film project, or creative endeavor.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
