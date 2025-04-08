import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { TermsDialog } from "./TermsDialog";

export function AuthDialog({ open, onOpenChange, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isSignUp && !acceptedTerms) {
      toast({
        title: "Terms acceptance required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Check for admin credentials
      const isAdmin = email === "admin@locscout.com" && password === "admin123";
      
      // For testing, accept any valid email/password combination
      if (email && password.length >= 6) {
        if (isAdmin) {
          localStorage.setItem("userData", JSON.stringify({
            id: "admin-id",
            tier: "pro",
            remainingSearches: Infinity,
            isAdmin: true,
            hasStreetView: true,
            hasSaveLocation: true,
            hasDetailedInsights: true,
            hasUnlimitedSearches: true,
            hasTeamAccess: true,
            hasApiAccess: true,
            isPremium: true,
            email
          }));

          toast({
            title: "Welcome, Admin!",
            description: "You now have access to all Pro features.",
          });
        } else {
          localStorage.setItem("userData", JSON.stringify({
            id: "user-" + Date.now(),
            tier: "free",
            remainingSearches: 5,
            hasStreetView: false,
            hasSaveLocation: false,
            hasDetailedInsights: false,
            hasUnlimitedSearches: false,
            hasTeamAccess: false,
            hasApiAccess: false,
            isPremium: false,
            email
          }));

          toast({
            title: isSignUp ? "Account created!" : "Welcome back!",
            description: "You can now start searching for locations.",
          });
        }

        localStorage.setItem("isAuthenticated", "true");
        onSuccess?.();
      } else {
        throw new Error("Invalid email or password (minimum 6 characters required)");
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setAcceptedTerms(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isSignUp ? "Create an account" : "Welcome back"}</DialogTitle>
            <DialogDescription>
              {isSignUp
                ? "Sign up to start discovering perfect locations."
                : "Sign in to your account to continue."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            {isSignUp && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={setAcceptedTerms}
                  disabled={isLoading}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground"
                >
                  I accept the{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setShowTerms(true)}
                  >
                    terms and conditions
                  </button>
                </label>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : isSignUp ? "Create account" : "Sign in"}
            </Button>
            <div className="text-center text-sm">
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={toggleSignUp}
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {showTerms && (
        <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
      )}
    </>
  );
}
