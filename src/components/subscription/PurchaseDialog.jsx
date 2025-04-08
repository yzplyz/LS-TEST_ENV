
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export function PurchaseDialog({ plan, open, onOpenChange }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
      
      toast({
        title: "Subscription activated!",
        description: `Welcome to ${plan.name}! You now have access to all features.`,
      });

      // Update user data in localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      localStorage.setItem("userData", JSON.stringify({
        ...userData,
        tier: plan.name.toLowerCase(),
      }));

      // Return to search
      navigate("/search");
    }, 2000);
  };

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upgrade to {plan.name}</DialogTitle>
          <DialogDescription>
            Enter your payment details to start your subscription
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handlePurchase} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="card">Card Number</Label>
            <Input
              id="card"
              placeholder="4242 4242 4242 4242"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Pay ${plan.price}/${plan.period || 'month'}`}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            You can cancel your subscription at any time
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
