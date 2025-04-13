export async function performSearch(query) {
  if (!query.trim()) {
    throw new Error('Please enter a search term.');
  }

  try {
    // Use a public CORS proxy service
    const corsProxy = 'https://corsproxy.io/?';
    const apiUrl = 'https://locscout-backend.vercel.app/api/search';
    
    console.log('Attempting search with query:', query);
    
    const response = await fetch(corsProxy + encodeURIComponent(apiUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query.trim() })
    });

    console.log('Search response status:', response.status);

    if (!response.ok) {
      throw new Error(`Search failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Search results count:', (data.results || []).length);
    return data.results || [];
  } catch (error) {
    console.error('Search API error:', error);
    throw new Error('Search failed, please try again.');
  }
}
