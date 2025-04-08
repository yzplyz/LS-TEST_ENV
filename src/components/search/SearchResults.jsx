import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Heart, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationDetail } from "./LocationDetail";
import { FolderSelectionDialog } from "@/components/folders/FolderSelectionDialog";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Correctly access the environment variable using Vite's import.meta.env
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_API_KEY;
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const RESULTS_PER_PAGE = 12;

const DEFAULT_VIEW = {
  longitude: -95.7129,
  latitude: 37.0902,
  zoom: 3
};

const MarkerStyle = {
  fill: 'hsl(var(--primary))',
  stroke: 'none',
  cursor: 'pointer'
};

export function SearchResults({ results = [], onBack, searchQuery = "" }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hoveredLocationId, setHoveredLocationId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [newSearchQuery, setNewSearchQuery] = useState(searchQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [showFolderSelection, setShowFolderSelection] = useState(false);
  const [locationToSave, setLocationToSave] = useState(null);
  const [viewState, setViewState] = useState(DEFAULT_VIEW);
  const [searchResults, setSearchResults] = useState(results);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const isPaidTier = userData.tier === "pro" || userData.tier === "locscout+";
  const isAdmin = userData.isAdmin;
  const folders = userData.folders || [];

  // Calculate current page results
  const currentResults = Array.isArray(searchResults) ? 
    searchResults.slice((currentPage - 1) * RESULTS_PER_PAGE, currentPage * RESULTS_PER_PAGE) : 
    [];

  const totalPages = Math.ceil((Array.isArray(searchResults) ? searchResults.length : 0) / RESULTS_PER_PAGE);

  // Update map view when results change
  React.useEffect(() => {
    try {
      if (!Array.isArray(searchResults) || searchResults.length === 0) {
        setViewState(DEFAULT_VIEW);
        return;
      }

      const validCoordinates = searchResults
        .map(location => {
          if (!location?.coordinates) return null;
          const lat = location.coordinates.latitude;
          const lng = location.coordinates.longitude;
          return (!isNaN(lat) && !isNaN(lng)) ? [lat, lng] : null;
        })
        .filter(Boolean);

      if (validCoordinates.length === 0) {
        setViewState(DEFAULT_VIEW);
        return;
      }

      const lats = validCoordinates.map(([lat]) => lat);
      const lngs = validCoordinates.map(([, lng]) => lng);

      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;

      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;
      const maxDiff = Math.max(latDiff, lngDiff);
      const zoom = Math.min(20, Math.max(1, Math.floor(8 - Math.log2(maxDiff))));

      setViewState({
        longitude: centerLng,
        latitude: centerLat,
        zoom: zoom
      });
    } catch (error) {
      console.error('Error calculating view state:', error);
      setViewState(DEFAULT_VIEW);
    }
  }, [searchResults]);

  // Update searchResults when props change
  React.useEffect(() => {
    setSearchResults(results);
  }, [results]);

  const handleNewSearch = async (e) => {
    e.preventDefault();
    
    if (!newSearchQuery.trim()) {
      toast({
        title: "Search required",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch("https://ah-software-submissions-subsequent.trycloudflare.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: newSearchQuery.trim()
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Search failed:", errorText);
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data.results || []);
      setCurrentPage(1);
      setShowSearch(false);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleMarkerClick = (e, location) => {
    e.originalEvent.stopPropagation();
    setSelectedLocation(location);
  };

  const handleSaveLocation = (location, e) => {
    e.stopPropagation();
    
    if (!isPaidTier && !isAdmin) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to LocScout+ to save locations",
        variant: "destructive",
      });
      return;
    }

    setLocationToSave(location);
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
    const isLocationInFolder = selectedFolder.locations?.some(loc => loc.id === locationToSave.id);
    
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
          locations: [...(folder.locations || []), locationToSave]
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
    setLocationToSave(null);
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
      locations: [locationToSave]
    };

    const updatedFolders = [...(currentData.folders || []), newFolder];

    localStorage.setItem("userData", JSON.stringify({
      ...currentData,
      folders: updatedFolders
    }));

    setShowFolderSelection(false);
    setLocationToSave(null);
    toast({
      title: "Folder created",
      description: `Location saved to new folder "${folderName}"`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Headers Container */}
      <div className="sticky top-0 z-20 bg-background">
        {/* Search Header */}
        <div className="border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">Results for "{searchQuery}"</h2>
                <p className="text-sm text-muted-foreground">
                  {Array.isArray(searchResults) ? searchResults.length : 0} locations found
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(!showSearch)}
                className="shrink-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleNewSearch} className="relative py-4 max-w-2xl mx-auto">
                    <Input
                      value={newSearchQuery}
                      onChange={(e) => setNewSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-24"
                      placeholder="Modify your search..."
                      disabled={isSearching}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Button 
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      disabled={isSearching}
                    >
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Results List */}
          <div className="space-y-4">
            {currentResults.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
                className="group relative cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-all"
                onClick={() => setSelectedLocation(location)}
                onMouseEnter={() => setHoveredLocationId(location.id || index)}
                onMouseLeave={() => setHoveredLocationId(null)}
              >
                {location.coordinates && (
                  <div className="aspect-video relative">
                    <img
                      src={`https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${location.coordinates.latitude},${location.coordinates.longitude}&key=${GOOGLE_MAPS_API_KEY}&source=outdoor`}
                      alt="Location Street View"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Street View image error in results list');
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/600x400?text=Street+View+Not+Available';
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                      onClick={(e) => handleSaveLocation(location, e)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <p className="font-medium">{location.address || "Location"}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {location.Coordinates}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {location.distance ? `${location.distance.toFixed(1)} miles away` : 'Distance unknown'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="sticky top-[73px] h-[calc(100vh-73px)]">
            <Map
              {...viewState}
              onMove={evt => setViewState(evt.viewState)}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken={MAPBOX_TOKEN}
            >
              {currentResults.map((location, index) => (
                location.coordinates && (
                  <Marker
                    key={index}
                    longitude={location.coordinates.longitude}
                    latitude={location.coordinates.latitude}
                    onClick={(e) => handleMarkerClick(e, location)}
                    style={MarkerStyle}
                  >
                    <MapPin
                      className={`h-6 w-6 text-primary ${
                        hoveredLocationId === index ? 'scale-125' : ''
                      }`}
                    />
                  </Marker>
                )
              ))}
            </Map>
          </div>
        </div>
      </div>

      {/* Location Detail Dialog */}
      {selectedLocation && (
        <LocationDetail
          location={selectedLocation}
          open={!!selectedLocation}
          onOpenChange={(open) => !open && setSelectedLocation(null)}
        />
      )}

      {/* Folder Selection Dialog */}
      <FolderSelectionDialog
        open={showFolderSelection}
        onOpenChange={setShowFolderSelection}
        folders={folders}
        onFolderSelect={handleFolderSelect}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
}
