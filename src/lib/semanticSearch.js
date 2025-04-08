const API_BASE_URL = 'http://localhost:5000/api';

export class SemanticSearch {
  constructor() {
    this.initialized = false;
    this.categories = null;
  }

  async initialize() {
    if (!this.initialized) {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const data = await response.json();
        this.categories = data.categories;
        this.initialized = true;
      } catch (error) {
        console.error('Failed to initialize semantic search:', error);
        throw error;
      }
    }
  }

  async search(query, category = null, top_k = 10, threshold = 0.4) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          category,
          top_k,
          threshold
        }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results.map(result => ({
        image_url: result.Image_url,
        analysis_result: result.Analysis_Result,
        score: result.similarity_score,
        coordinates: result.coordinates_available ? {
          latitude: result.latitude,
          longitude: result.longitude
        } : null
      }));
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  getCategories() {
    return this.categories || [];
  }
} 