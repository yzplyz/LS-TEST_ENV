
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function TermsDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Last updated: {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <h3 className="font-semibold">1. Introduction</h3>
          <p>
            Welcome to LocScout. By using our service, you agree to these terms and conditions.
            [Placeholder for detailed terms - to be updated]
          </p>

          <h3 className="font-semibold">2. Service Description</h3>
          <p>
            LocScout provides location scouting services for photographers and filmmakers.
            [Placeholder for service details - to be updated]
          </p>

          <h3 className="font-semibold">3. Privacy and Location Data</h3>
          <p>
            We collect and use location data to provide you with relevant results.
            [Placeholder for privacy details - to be updated]
          </p>

          <h3 className="font-semibold">4. Subscription Terms</h3>
          <p>
            Different subscription tiers provide varying levels of access and features.
            [Placeholder for subscription details - to be updated]
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
