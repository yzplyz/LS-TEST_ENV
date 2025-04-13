
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function PasswordProtection({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  // Check if already authenticated
  useEffect(() => {
    const hasAccess = localStorage.getItem("hasWebsiteAccess") === "true";
    setIsAuthenticated(hasAccess);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Updated password
    if (password === "LS2025") {
      localStorage.setItem("hasWebsiteAccess", "true");
      setIsAuthenticated(true);
      setPassword("");
    } else {
      toast({
        title: "Incorrect Password",
        description: "Please try again",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <img
            src="https://storage.googleapis.com/hostinger-horizons-assets-prod/5824771b-400a-4227-a9e8-9f8794985cfc/2bc5cac8f84eb5c17fbb853f3630d948.png"
            alt="LocScout"
            className="h-8 mx-auto mb-4"
          />
          <p className="text-sm text-muted-foreground">
            Please enter the password to access LocScout
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full"
            autoFocus
          />
          <Button type="submit" className="w-full">
            Access LocScout
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
