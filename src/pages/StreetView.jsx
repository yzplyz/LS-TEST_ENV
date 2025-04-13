
import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyD_dawLbEZuo04y--pvfeWHMiBBYsX7eaI";

export function StreetView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const streetViewRef = useRef(null);
  const locationData = location.state?.location;

  useEffect(() => {
    if (!locationData) {
      navigate('/search');
      return;
    }

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=streetview`;
    script.async = true;
    script.onload = initializeStreetView;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [locationData]);

  const initializeStreetView = () => {
    if (!locationData || !window.google) return;

    const [lat, lng] = locationData.coordinates
      .replace("° N", "")
      .replace("° W", "")
      .split(", ")
      .map(coord => parseFloat(coord));

    // Initialize Street View
    const panorama = new window.google.maps.StreetViewPanorama(
      streetViewRef.current,
      {
        position: { lat, lng: -lng },
        pov: { heading: 165, pitch: 0 },
        zoom: 1,
        addressControl: true,
        fullscreenControl: true,
        motionTracking: false,
        motionTrackingControl: false,
        showRoadLabels: true,
        visible: true
      }
    );

    // Handle no street view available
    const service = new window.google.maps.StreetViewService();
    service.getPanorama({ location: { lat, lng: -lng }, radius: 50 }, (data, status) => {
      if (status !== "OK") {
        toast({
          title: "Street View not available",
          description: "This location doesn't have Street View coverage.",
          variant: "destructive",
        });
      }
    });
  };

  if (!locationData) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{locationData.address}</h2>
              <p className="text-sm text-muted-foreground">
                {locationData.coordinates}
              </p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <div
          ref={streetViewRef}
          className="w-full aspect-[16/9] rounded-lg overflow-hidden"
        />
      </motion.div>
    </div>
  );
}
