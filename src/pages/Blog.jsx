
import React from "react";
import { motion } from "framer-motion";
import { MainNav } from "@/components/layout/MainNav";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Hidden Gems for Urban Photography",
      excerpt: "Discover unexpected locations that make for stunning urban photography backdrops...",
      author: "Sarah Chen",
      date: "October 15, 2023",
      category: "Photography",
      imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      title: "How to Scout Locations Like a Pro",
      excerpt: "Learn the essential tips and tricks for finding perfect shooting locations...",
      author: "Michael Rodriguez",
      date: "October 12, 2023",
      category: "Tips & Tricks",
      imageUrl: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      title: "Industrial Spaces: A Photographer's Paradise",
      excerpt: "Why abandoned warehouses and factories make for compelling photoshoots...",
      author: "Alex Thompson",
      date: "October 8, 2023",
      category: "Locations",
      imageUrl: "https://images.unsplash.com/photo-1518481852452-9415b262eba4?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 4,
      title: "Natural Light Photography: Location Matters",
      excerpt: "How to find locations with perfect natural lighting for your shoots...",
      author: "Emma Wilson",
      date: "October 5, 2023",
      category: "Lighting",
      imageUrl: "https://images.unsplash.com/photo-1470723710355-95304d8aece4?w=800&auto=format&fit=crop&q=60"
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
            <h1 className="text-3xl font-bold mb-4">LocScout Blog</h1>
            <p className="text-lg text-muted-foreground">
              Tips, insights, and inspiration for photographers and filmmakers
            </p>
          </motion.div>

          <div className="grid gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group grid md:grid-cols-2 gap-6 items-center border rounded-lg p-4 hover:bg-accent/5 transition-colors"
              >
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-primary">
                      {post.category}
                    </span>
                    <h2 className="text-2xl font-semibold">{post.title}</h2>
                    <p className="text-muted-foreground">{post.excerpt}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </div>
                  </div>

                  <Button variant="ghost" className="group/button">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
