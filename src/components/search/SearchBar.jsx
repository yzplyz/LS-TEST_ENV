import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('Please enter a search term');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Making search request with query:', trimmedQuery);
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          query: trimmedQuery,
          category: 'full'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search failed:', errorText);
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Search results:', data);
      
      if (!data || !data.results) {
        throw new Error('Invalid response format');
      }

      onSearchResults(data.results);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe a location..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          disabled={isLoading}
        >
          <FaSearch className="w-4 h-4" />
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
};

export default SearchBar; 