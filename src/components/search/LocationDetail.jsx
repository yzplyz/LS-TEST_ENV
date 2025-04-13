
import React, { useState, useEffect } from "react";
import { Crown, MapPin, Share2, Copy, Eye, Heart, Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FolderSelectionDialog } from "@/components/folders/FolderSelectionDialog";
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWljaGFlbGxvY3Njb3V0IiwiYSI6ImNtOHA0ZXJqYjA3Z2IybHB1MDVnaHZxd2QifQ.coD8SIKjdfvchSxiKBidDw';
const GOOGLE_MAPS_API_KEY = "AIzaSyD_dawLbEZuo04y--pvfeWHMiBBYsX7eaI";

export function LocationDetail({ location, open, onOpenChange }) {
  const { toast } = useToast();
  const [showStreetView, setShowStreetView] = useState(false);
  const [hasStreetView, setHasStreetView] = useState(false);
  const [showFolderSelection, setShowFolderSelection] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const isPaidTier = userData.tier === "pro" || userData.tier === "locscout+";
  const isAdmin = userData.isAdmin;
  const folders = userData.folders || [];

  // Parse coordinates safely
  const getCoordinates = () => {
    try {
      if (!location || !location.Coordinates) {
        return [0, 0];
      }

      const coords = location.Coordinates;
      
      if (Array.isArray(coords)) {
        return coords;
      }
      
      if (typeof coords === 'string') {
        const [lat, lng] = coords.split(",").map(coord => parseFloat(coord.trim()));
        return [lat, lng];
      }

      return [0, 0];
    } catch (error) {
      console.error('Error parsing coordinates:', error);
      return [0, 0];
    }
  };

  const [lat, lng] = getCoordinates();

  useEffect(() => {
    if (!location) return;

    if (window.google && window.google.maps) {
      const service = new window.google.maps.StreetViewService();
      service.getPanorama({ location: { lat, lng }, radius: 50 }, (data, status) => {
        setHasStreetView(status === "OK");
      });
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=streetview`;
      script.async = true;
      script.onload = () => {
        const service = new window.google.maps.StreetViewService();
        service.getPanorama({ location: { lat, lng }, radius: 50 }, (data, status) => {
          setHasStreetView(status === "OK");
        });
      };
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [lat, lng, location]);

  const handleSave = () => {
    if (!isPaidTier && !isAdmin) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to LocScout+ to save locations",
        variant: "destructive",
      });
      return;
    }
    
    setShowFolderSelection(true);
  };

  const handleFolderSelect = (folderId) => {
    const currentData = JSON.parse(localStorage.getItem("userData") || "{}");
    const selectedFolder = currentData.folders?.find(f => f.id === folderId);
    
    if (!selectedFolder) {
      toast({
        title: "Error",
        description: "Selected folder not found",
        variant: "destructive",
      });
      return;
    }

    // Check if location is already in the folder
    const isLocationInFolder = selectedFolder.locations?.some(loc => loc.id === location.id);
    
    if (isLocationInFolder) {
      toast({
        title: "Already saved",
        description: "This location is already in this folder",
      });
      return;
    }

    // Add location to folder
    const updatedFolders = currentData.folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          locations: [...(folder.locations || []), location]
        };
      }
      return folder;
    });

    // Update localStorage
    localStorage.setItem("userData", JSON.stringify({
      ...currentData,
      folders: updatedFolders
    }));

    setShowFolderSelection(false);
    toast({
      title: "Location saved",
      description: "Location has been added to the selected folder",
    });
  };

  const handleCreateFolder = (folderName) => {
    const currentData = JSON.parse(localStorage.getItem("userData") || "{}");
    const newFolder = {
      id: Date.now(),
      name: folderName,
      locations: [location]
    };

    const updatedFolders = [...(currentData.folders || []), newFolder];

    localStorage.setItem("userData", JSON.stringify({
      ...currentData,
      folders: updatedFolders
    }));

    setShowFolderSelection(false);
    toast({
      title: "Folder created",
      description: `Location saved to new folder "${folderName}"`,
    });
  };

  const handleCopyCoordinates = async () => {
    try {
      const coordsText = `${lat}, ${lng}`;
      await navigator.clipboard.writeText(coordsText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      toast({
        title: "Coordinates copied",
        description: "Location coordinates have been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please try copying the coordinates manually",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    toast({
      title: "Share feature coming soon",
      description: "You'll be able to share locations with others shortly",
    });
  };

  const handleStreetView = () => {
    if (!isPaidTier && !isAdmin) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to LocScout+ to access Street View",
        variant: "destructive",
      });
      return;
    }

    if (!hasStreetView) {
      toast({
        title: "Street View unavailable",
        description: "This location doesn't have Street View coverage",
        variant: "destructive",
      });
      return;
    }

    setShowStreetView(true);
  };

  if (!location) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
          <div className="relative w-full aspect-video">
            {showStreetView ? (
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/streetview?key=${GOOGLE_MAPS_API_KEY}&location=${lat},${lng}&heading=210&pitch=10&fov=90`}
                allowFullScreen
              />
            ) : (
              <Map
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={{
                  longitude: lng,
                  latitude: lat,
                  zoom: 15
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
              >
                <Marker
                  longitude={lng}
                  latitude={lat}
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-8 h-8 text-primary"
                  >
                    <path 
                      fill="currentColor"
                      d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z" 
                    />
                  </svg>
                </Marker>
              </Map>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* Location Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-lg font-medium">
                <MapPin className="h-5 w-5" />
                <span>{location.address || "Location"}</span>
              </div>
              <p className="text-muted-foreground">
                Coordinates: {lat}, {lng}
              </p>
              <p className="text-muted-foreground">
                {location.distance ? `${location.distance.toFixed(1)} miles away` : 'Distance unknown'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Button
                  variant={showStreetView ? "default" : "outline"}
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleStreetView}
                  disabled={!hasStreetView && (isPaidTier || isAdmin)}
                >
                  <Eye className="h-4 w-4" />
                  {showStreetView ? "View Map" : "Street View"}
                  {!isPaidTier && !isAdmin && <Crown className="h-4 w-4 text-primary ml-1" />}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleSave}
                >
                  <Heart className="h-4 w-4" />
                  Save Location
                  {!isPaidTier && !isAdmin && <Crown className="h-4 w-4 text-primary ml-1" />}
                </Button>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleCopyCoordinates}
                >
                  {isCopied ? (
                    "Copied!"
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Coordinates
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Share Location
                </Button>
              </div>
            </div>

            {/* Premium Features Promotion */}
            {!isPaidTier && !isAdmin && (
              <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Crown className="h-4 w-4 text-primary" />
                  Premium Features
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Save unlimited locations</li>
                  <li>• Access Street View integration</li>
                  <li>• Get detailed location insights</li>
                  <li>• More search results per query</li>
                </ul>
                <Button 
                  className="w-full"
                  onClick={() => {
                    onOpenChange(false);
                    navigate("/pricing");
                  }}
                >
                  Upgrade to LocScout+
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <FolderSelectionDialog
        open={showFolderSelection}
        onOpenChange={setShowFolderSelection}
        folders={folders}
        onFolderSelect={handleFolderSelect}
        onCreateFolder={handleCreateFolder}
      />
    </>
  );
}
