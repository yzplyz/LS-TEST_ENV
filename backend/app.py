from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import json
from pathlib import Path
import numpy as np
from sentence_transformers import SentenceTransformer
import pandas as pd
import re

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

def handle_preflight():
    response = jsonify({})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return response

def extract_coordinates_from_url(url):
    """Extract latitude and longitude from Google Street View URL."""
    try:
        # Try to find coordinates in the URL
        match = re.search(r'@(-?\d+\.\d+),(-?\d+\.\d+)', url)
        if match:
            return float(match.group(1)), float(match.group(2))
    except:
        pass
    return None, None

# Initialize search components
class LocationSearcher:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.load_data()
        
    def load_data(self):
        # Use absolute path to vectorized_data
        data_dir = Path(r'C:\Users\wavyc\OneDrive\Desktop\LocScout-AWS\vectorized_data')
        print(f"Looking for data in: {data_dir}")
        
        if not data_dir.exists():
            raise FileNotFoundError(f"Data directory not found at {data_dir}")
            
        # Load metadata with coordinates
        metadata_path = data_dir / 'metadata_with_coordinates.csv'
        if not metadata_path.exists():
            raise FileNotFoundError(f"Metadata file not found at {metadata_path}")
            
        print(f"Loading metadata from: {metadata_path}")
        self.metadata = pd.read_csv(metadata_path)
        print("Successfully loaded metadata")
        print(f"Number of locations: {len(self.metadata)}")
        print("Metadata columns:", self.metadata.columns.tolist())
        
        # Verify coordinates exist
        if 'latitude' not in self.metadata.columns or 'longitude' not in self.metadata.columns:
            raise ValueError("Metadata file missing latitude/longitude columns")
            
        # Load vectors
        self.vectors = {}
        for category in ['full', 'colors', 'materials', 'architecture', 'aesthetics', 'landscaping', 'mood_vibes']:
            vector_path = data_dir / f'{category}_vectors.npy'
            if vector_path.exists():
                self.vectors[category] = np.load(vector_path)
                print(f"Loaded vectors for {category}: {self.vectors[category].shape}")
            else:
                print(f"Warning: Could not find vectors for {category}")
                
        print("Data loading complete!")
        
    def search(self, query, category=None, top_k=100, threshold=0.2):
        try:
            # Get query embedding
            query_embedding = self.model.encode(query)
            
            # Use appropriate vectors
            vectors = self.vectors['full'] if category is None else self.vectors.get(category)
            if vectors is None:
                return []
                
            # Calculate similarities
            similarities = np.dot(vectors, query_embedding) / (
                np.linalg.norm(vectors, axis=1) * np.linalg.norm(query_embedding)
            )
            
            # Get top results
            top_indices = np.argsort(similarities)[-top_k:][::-1]
            top_scores = similarities[top_indices]
            
            # Filter by threshold and prepare results
            results = []
            print(f"\nProcessing search results for query: {query}")
            print("Top indices:", top_indices)
            print("Top scores:", top_scores)
            
            for idx, score in zip(top_indices, top_scores):
                if score < threshold:
                    continue
                    
                try:
                    row = self.metadata.iloc[idx]
                    print(f"\nProcessing row {idx}:")
                    print("Raw data from metadata:")
                    print(f"Image_url: {row['Image_url']}")
                    print(f"latitude: {row['latitude']} ({type(row['latitude'])})")
                    print(f"longitude: {row['longitude']} ({type(row['longitude'])})")
                    
                    # Skip if coordinates are missing or invalid
                    try:
                        lat = float(row['latitude'])
                        lng = float(row['longitude'])
                        
                        # Skip if coordinates are NaN or out of range
                        if pd.isna(lat) or pd.isna(lng):
                            print(f"Skipping result {idx}: NaN coordinates")
                            continue
                            
                        if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
                            print(f"Skipping result {idx}: Coordinates out of range")
                            continue
                            
                        # Extract heading from original URL
                        heading_match = re.search(r'heading=([^&]+)', row['Image_url'])
                        heading = heading_match.group(1) if heading_match else '0'
                        
                        # Create location object with valid coordinates
                        location = {
                            'id': str(idx),
                            'coordinates': {
                                'latitude': lat,
                                'longitude': lng
                            },
                            'similarity_score': float(score),
                            'image_url': str(row['Image_url']).strip(),
                            'public_url': f"https://www.google.com/maps/@{lat},{lng},3a,75y,0h,90t/data=!3m6!1e1!3m4!1s!2e0!7i16384!8i8192"
                        }
                        
                        print("Created location object:", location)
                        results.append(location)
                        
                    except (ValueError, TypeError) as e:
                        print(f"Error converting coordinates for row {idx}: {str(e)}")
                        continue
                        
                except Exception as e:
                    print(f"Error processing row {idx}: {str(e)}")
                    continue
            
            print(f"\nFound {len(results)} valid results")
            return results
            
        except Exception as e:
            print(f"Search error: {str(e)}")
            return []

    def extract_coordinates_from_url(self, url):
        """Extract latitude and longitude from Google Street View URL."""
        try:
            # Try to find coordinates in the URL format: ...location=LAT,LNG&...
            match = re.search(r'location=(-?\d+\.\d+),(-?\d+\.\d+)', url)
            if match:
                return float(match.group(1)), float(match.group(2))
        except Exception as e:
            print(f"Error extracting coordinates from URL: {e}")
        return None, None

# Initialize searcher
print("Initializing LocationSearcher...")
searcher = LocationSearcher()
print("LocationSearcher initialized successfully!")

@app.route('/api/search', methods=['POST', 'OPTIONS'])
def search():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        return response

    data = request.get_json()
    query = data.get('query', '')
    category = data.get('category', None)
    top_k = data.get('top_k', 100)
    threshold = data.get('threshold', 0.2)

    print(f"Processing search results for query: {query}")
    
    try:
        # Get search results
        results = searcher.search(query, category, top_k)
        
        # Transform results for frontend
        transformed_results = []
        for result in results:
            transformed = {
                'image_url': result['image_url'],
                'score': result['similarity_score'],
                'coordinates': result['coordinates'],
                'public_url': result['public_url']
            }
            print(f"Transformed result: {transformed}")
            transformed_results.append(transformed)
        
        response = jsonify({'results': transformed_results})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        return response

    except Exception as e:
        print(f"Search error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories')
def get_categories():
    """Get available search categories."""
    try:
        categories = list(searcher.vectors.keys())
        response = jsonify({'categories': categories})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        return response
    except Exception as e:
        print(f"Categories error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 