import React from 'react';

const SearchResults = ({ results }) => {
  console.log('Raw results received:', results);

  // Handle case where results is undefined or null
  if (!results) {
    return <div className="text-center py-4">No results available</div>;
  }

  // Extract results array from the response
  const searchResults = results.results || [];
  console.log('Processed results:', searchResults);

  if (searchResults.length === 0) {
    return <div className="text-center py-4">No results found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {searchResults.map((location, index) => {
        if (!location || !location.coordinates) {
          console.warn('Invalid location data:', location);
          return null;
        }

        const { latitude, longitude } = location.coordinates;
        
        return (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
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
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-2">
                Score: {(location.score * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
              {location.public_url && (
                <a
                  href={location.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm block mt-2"
                >
                  View on Google Maps
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SearchResults;
