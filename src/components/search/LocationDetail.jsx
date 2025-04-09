import React, { useState, useEffect, useRef } from "react";
import { Crown, MapPin, Share2, Copy, Eye, Heart, Plus, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FolderSelectionDialog } from "@/components/folders/FolderSelectionDialog";
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWljaGFlbGxvY3Njb3V0IiwiYSI6ImNtOHA0ZXJqYjA3Z2IybHB1MDVnaHZxd2QifQ.coD8SIKjdfvchSxiKBidDw';
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_API_KEY;

// Add referrer meta tag to head
const addReferrerTag = () => {
  if (typeof document !== 'undefined' && !document.querySelector('meta[name="referrer"]')) {
    const meta = document.createElement('meta');
    meta.name = 'referrer';
    meta.content = 'no-referrer-when-downgrade';
    document.head.appendChild(meta);
  }
};

// Call it once when component loads
addReferrerTag();

// Function to construct Street View static image URL
const getStreetViewImageUrl = (lat, lng) => {
  return `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${lat},${lng}&fov=90&heading=0&pitch=0&key=${GOOGLE_MAPS_API_KEY}`;
};

// Function to get Google Maps Street View URL
const getGoogleMapsUrl = (lat, lng) => {
  return `https://www.google.com/maps/@${lat},${lng},3a,75y,0h,90t/data=!3m6!1e1!3m4!1s!2e0!7i16384!8i8192`;
};

export function LocationDetail({ location, open, onOpenChange }) {
  const { toast } = useToast();
  const [hasStreetView, setHasStreetView] = useState(true);
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
      if (!location || !location.coordinates) {
        return [0, 0];
      }

      return [
        parseFloat(location.coordinates.latitude),
        parseFloat(location.coordinates.longitude)
      ];
    } catch (error) {
      console.error('Error parsing coordinates:', error);
      return [0, 0];
    }
  };

  const [lat, lng] = getCoordinates();

  // Handle Street View click
  const handleStreetViewClick = () => {
    if (!isPaidTier && !isAdmin) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to LocScout+ to access Street View",
        variant: "destructive",
      });
      return;
    }

    const streetViewUrl = `https://www.google.com/maps/@${lat},${lng},3a,75y,0h,90t/data=!3m6!1e1!3m4!1s!2e0!7i16384!8i8192`;
    window.open(streetViewUrl, '_blank', 'noopener,noreferrer');
  };

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

  const handleCopyCoordinates = () => {
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = () => {
    toast({
      title: "Share feature coming soon",
      description: "You'll be able to share locations with others shortly",
    });
  };

  if (!location) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
          <div className="relative w-full aspect-video">
            <Map
              mapboxAccessToken={MAPBOX_TOKEN}
              initialViewState={{
                longitude: lng,
                latitude: lat,
                zoom: 15
              }}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
            >
              <Marker
                longitude={lng}
                latitude={lat}
                color="#FF0000"
              />
            </Map>
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
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleStreetViewClick}
                  disabled={!hasStreetView && (isPaidTier || isAdmin)}
                >
                  <Eye className="h-4 w-4" />
                  Open Street View
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
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
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
