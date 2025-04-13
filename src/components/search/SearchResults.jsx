import React, { useState, useEffect } from "react";
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
import { searchWithAI } from "@/lib/openai";
import { searchVectors } from "@/lib/vectorService";

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWljaGFlbGxvY3Njb3V0IiwiYSI6ImNtOHA0ZXJqYjA3Z2IybHB1MDVnaHZxd2QifQ.coD8SIKjdfvchSxiKBidDw';

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

const GOOGLE_MAPS_API_KEY = "AIzaSyD_dawLbEZuo04y--pvfeWHMiBBYsX7eaI";

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
          if (!location?.Coordinates) return null;
          const [lat, lng] = location.Coordinates.split(',').map(coord => parseFloat(coord.trim()));
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
    
    // Debug the incoming results to see what URLs are available
    if (Array.isArray(results) && results.length > 0) {
      const sample = results[0];
      console.log("Sample result data:", {
        name: sample.Name,
        coordinates: sample.Coordinates,
        image_url: sample.image_url,
        public_url: sample.public_url,
        // Log all fields to see what's available
        allFields: Object.keys(sample)
      });
    }
  }, [results]);

  // Handle new search with direct vectorService
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
      // Get embedding from OpenAI
      const { embedding } = await searchWithAI(newSearchQuery.trim());
      
      // Use vector search directly without going through the API
      // This avoids CORS issues completely since it's all client-side
      const { searchVectors } = await import('../../lib/vectorService.js');
      const results = await searchVectors(embedding);
      
      if (!Array.isArray(results) || results.length === 0) {
        toast({
          title: "No results found",
          description: "Try a different search term",
          variant: "destructive",
        });
        return;
      }

      setSearchResults(results);
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

  // Function to parse coordinates
  const parseCoordinates = (coords) => {
    try {
      if (!coords) {
        console.debug('No coordinates provided');
        return null;
      }
      const [lat, lng] = coords.split(',').map(coord => parseFloat(coord.trim()));
      if (isNaN(lat) || isNaN(lng)) {
        console.debug('Invalid coordinate values:', coords);
        return null;
      }
      if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
        console.debug('Coordinates out of valid range:', coords);
        return null;
      }
      return [lat, lng];
    } catch (error) {
      console.error('Error parsing coordinates:', coords, error);
      return null;
    }
  };

  // Pre-process coordinates for map markers and image URLs
  const processedResults = React.useMemo(() => {
    return currentResults.map(location => {
      // Parse coordinates for the map
      const coords = parseCoordinates(location.Coordinates);
      
      // Use the provided URLs from the data
      return {
        ...location,
        processedCoords: coords,
        staticImageUrl: location.image_url, // Use image_url for card display
        streetViewUrl: location.public_url // Use public_url for redirection
      };
    });
  }, [currentResults]);

  // Handle Street View button click
  const handleStreetViewClick = (location, e) => {
    e.stopPropagation();
    if (location.public_url) {
      window.open(location.public_url, '_blank');
    } else if (location.streetViewUrl) {
      window.open(location.streetViewUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-medium">
              Results for "{searchQuery}"
              <span className="text-sm text-muted-foreground ml-2">
                {searchResults?.length || 0} locations found
              </span>
            </h1>
          </div>
          <Button variant="outline" onClick={() => setShowSearch(true)}>
            <Search className="h-4 w-4 mr-2" />
            New Search
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto">
        <div className="space-y-6">
          {processedResults.map((location, index) => {            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-card rounded-lg overflow-hidden border shadow-sm"
                onClick={() => setSelectedLocation(location)}
              >
                <div className="w-full h-48 relative">
                  {location.staticImageUrl ? (
                    <img
                      src={location.staticImageUrl}
                      alt={location.Name || 'Location view'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', location.Name, location.staticImageUrl);
                        const fallbackDiv = document.createElement('div');
                        fallbackDiv.className = 'flex items-center justify-center h-full bg-muted';
                        fallbackDiv.innerHTML = '<svg class="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0Z"/></svg>';
                        e.target.parentElement.replaceChild(fallbackDiv, e.target);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{location.Name}</h3>
                    </div>
                    <div className="flex gap-2">
                      {(location.public_url || location.streetViewUrl) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleStreetViewClick(location, e)}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleSaveLocation(location, e)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="hidden md:block h-[calc(100vh-8rem)] sticky top-24">
          {searchResults && searchResults.length > 0 && (
            <Map
              key="map-component"
              mapboxAccessToken={MAPBOX_TOKEN}
              {...viewState}
              onMove={evt => setViewState(evt.viewState)}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/streets-v12"
            >
              {processedResults.map((location, index) => {
                if (!location.processedCoords) return null;
                
                return (
                  <Marker
                    key={`marker-${index}`}
                    longitude={location.processedCoords[1]}
                    latitude={location.processedCoords[0]}
                    onClick={(e) => handleMarkerClick(e, location)}
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      style={MarkerStyle}
                      className={`w-6 h-6 transition-all ${
                        hoveredLocationId === location.id ? 'scale-150' : ''
                      }`}
                      onMouseEnter={() => setHoveredLocationId(location.id)}
                      onMouseLeave={() => setHoveredLocationId(null)}
                    >
                      <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z" />
                    </svg>
                  </Marker>
                );
              })}
            </Map>
          )}
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
