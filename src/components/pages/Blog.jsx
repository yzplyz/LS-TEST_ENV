import React from "react";
import { motion } from "framer-motion";
import { MainNav } from "@/components/layout/MainNav";
import { Calendar, User } from "lucide-react";

export function Blog() {
  const posts = [
    {
      title: "Top 10 Urban Photography Locations",
      excerpt: "Discover the best urban spots for your next photoshoot...",
      author: "Sarah Chen",
      date: "October 15, 2023",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=60"
    },
    {
      title: "How to Scout Locations Like a Pro",
      excerpt: "Expert tips for finding the perfect shooting locations...",
      author: "Mike Rodriguez",
      date: "October 12, 2023",
      image: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=800&auto=format&fit=crop&q=60"
    },
    {
      title: "Location Permits: A Complete Guide",
      excerpt: "Everything you need to know about location permits...",
      author: "Alex Thompson",
      date: "October 10, 2023",
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">LocScout Blog</h1>
            <p className="text-muted-foreground">
              Tips, insights, and inspiration for photographers and filmmakers
            </p>
          </div>

          <div className="grid gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border bg-card overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-48 w-full object-cover md:h-full"
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}