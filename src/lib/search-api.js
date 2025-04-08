
export async function performSearch(query) {
  if (!query.trim()) {
    throw new Error('Please enter a search term.');
  }

  const response = await fetch('https://night-shakira-exams-suits.trycloudflare.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query.trim() })
  });

  if (!response.ok) {
    throw new Error('Search failed, please try again.');
  }

  const data = await response.json();
  return data.results || [];
}
