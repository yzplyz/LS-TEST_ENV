import React, { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Pin from './Pin';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWljaGFlbGxvY3Njb3V0IiwiYSI6ImNtOHA0ZXJqYjA3Z2IybHB1MDVnaHZxd2QifQ.coD8SIKjdfvchSxiKBidDw';

const pinStyle = {
  cursor: 'pointer',
  fill: '#6B46C1', // Tailwind's purple-700
  stroke: 'none'
};

const popupStyle = {
  zIndex: 1,
  background: 'white',
  borderRadius: '8px',
  padding: '0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  maxWidth: '200px'
};

const SearchResults = ({ results }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!results) {
    return <div className="text-center py-4">No results available</div>;
  }

  const searchResults = Array.isArray(results) ? results : results.results || [];

  if (searchResults.length === 0) {
    return <div className="text-center py-4">No results found</div>;
  }

  const centerLat = searchResults[0]?.coordinates?.latitude || 33.7490;
  const centerLng = searchResults[0]?.coordinates?.longitude || -84.3880;

  const handleCopyCoordinates = (lat, lng) => {
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStreetViewClick = (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      {/* Map Section */}
      <div className="lg:w-1/2 h-[500px] rounded-lg overflow-hidden shadow-lg">
        <Map
          initialViewState={{
            latitude: centerLat,
            longitude: centerLng,
            zoom: 11
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          reuseMaps
          interactiveLayerIds={['markers']}
        >
          {searchResults.map((location, index) => {
            if (!location?.coordinates?.latitude || !location?.coordinates?.longitude) {
              console.warn('Invalid coordinates for location:', location);
              return null;
            }
            return (
              <React.Fragment key={index}>
                <Marker
                  latitude={location.coordinates.latitude}
                  longitude={location.coordinates.longitude}
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setSelectedLocation(location);
                  }}
                  onMouseEnter={() => setHoveredLocation(location)}
                  onMouseLeave={() => setHoveredLocation(null)}
                >
                  <Pin style={pinStyle} size={20} />
                </Marker>
                {hoveredLocation === location && (
                  <Popup
                    latitude={location.coordinates.latitude}
                    longitude={location.coordinates.longitude}
                    closeButton={false}
                    closeOnClick={false}
                    anchor="top"
                    offset={[0, -15]}
                    style={popupStyle}
                    onClose={() => setHoveredLocation(null)}
                  >
                    <div className="p-2">
                      <img
                        src={location.image_url}
                        alt={`Location at ${location.coordinates.latitude}, ${location.coordinates.longitude}`}
                        className="w-full h-32 object-cover rounded-t"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
                        }}
                      />
                      <div className="mt-2 text-center text-sm font-semibold text-purple-700">
                        {((location.score || location.similarity_score) * 100).toFixed(1)}% Match
                      </div>
                    </div>
                  </Popup>
                )}
              </React.Fragment>
            );
          })}
        </Map>
      </div>

      {/* Results Grid */}
      <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
        {searchResults.map((location, index) => {
          if (!location?.coordinates?.latitude || !location?.coordinates?.longitude) {
            console.warn('Invalid location data:', location);
            return null;
          }

          const { latitude, longitude } = location.coordinates;
          const score = location.score || location.similarity_score;
          
          return (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition hover:scale-105"
              onClick={() => setSelectedLocation(location)}
            >
              <div className="relative h-48">
                <img
                  src={location.image_url}
                  alt={`Location at ${latitude}, ${longitude}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
                  }}
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                  {(score * 100).toFixed(1)}%
                </div>
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <button 
                    className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-700 transition shadow"
                    onClick={(e) => handleStreetViewClick(e, location.public_url)}
                  >
                    Street View
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      {latitude.toFixed(6)}, {longitude.toFixed(6)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyCoordinates(latitude, longitude);
                      }}
                      className="text-purple-600 hover:text-purple-800 text-sm"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    {location.public_url && (
                      <a
                        href={location.public_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View on Google Maps
                      </a>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = '/upgrade';
                      }}
                      className="text-purple-600 hover:text-purple-800 text-sm"
                    >
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Location Detail Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Location Details</h2>
                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="relative h-96">
                <img
                  src={selectedLocation.image_url}
                  alt={`Location at ${selectedLocation.coordinates.latitude}, ${selectedLocation.coordinates.longitude}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                  {((selectedLocation.score || selectedLocation.similarity_score) * 100).toFixed(1)}%
                </div>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button 
                    className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition shadow"
                    onClick={(e) => handleStreetViewClick(e, selectedLocation.public_url)}
                  >
                    Street View
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">
                      {selectedLocation.coordinates.latitude.toFixed(6)}, {selectedLocation.coordinates.longitude.toFixed(6)}
                    </p>
                    <button
                      onClick={() => handleCopyCoordinates(selectedLocation.coordinates.latitude, selectedLocation.coordinates.longitude)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    {selectedLocation.public_url && (
                      <a
                        href={selectedLocation.public_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View on Google Maps
                      </a>
                    )}
                    <button
                      onClick={() => window.location.href = '/upgrade'}
                      className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-900 transition shadow"
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
