import { tensor, tensor2d } from '@tensorflow/tfjs';

// Cache for vector data
let vectorDataCache = null;

// Load vector data
const loadVectorData = async () => {
  // Return cached data if available
  if (vectorDataCache) {
    console.log('Using cached vector data');
    return vectorDataCache;
  }

  try {
    console.log('Starting to load vector data...');
    
    // First try to load metadata
    const metadataResponse = await fetch('/LocScout_Data_Backup/metadata_with_coordinates.csv');
    if (!metadataResponse.ok) {
      console.error('Failed to load metadata:', metadataResponse.status, metadataResponse.statusText);
      throw new Error('Failed to load metadata');
    }
    const metadataText = await metadataResponse.text();
    console.log('Metadata loaded, parsing CSV...');
    const metadata = parseCSV(metadataText);
    console.log('Metadata parsed, found', metadata.length, 'entries');

    // Then load vector data
    const vectorFiles = {
      aesthetics: 'aesthetics_vectors.npy',
      architecture: 'architecture_vectors.npy',
      color: 'colors_vectors.npy',
      mood: 'mood_vibes_vectors.npy'
    };

    const vectors = {};
    
    // Load each vector file
    for (const [key, filename] of Object.entries(vectorFiles)) {
      console.log(`Loading vector file: ${filename}`);
      const response = await fetch(`/LocScout_Data_Backup/${filename}`);
      if (!response.ok) {
        console.error(`Failed to load ${filename}:`, response.status, response.statusText);
        throw new Error(`Failed to load ${key} vectors`);
      }
      
      // Read the NPY header (first 128 bytes typically contain metadata)
      const arrayBuffer = await response.arrayBuffer();
      console.log(`Loaded ${filename}, size:`, arrayBuffer.byteLength, 'bytes');
      
      // Skip the header (assuming standard NPY v1.0 format)
      const dataOffset = 128;
      
      // Create a Float32Array view of the actual data
      const float32Array = new Float32Array(
        arrayBuffer.slice(dataOffset, arrayBuffer.byteLength)
      );
      
      // Calculate the number of vectors and vector dimension
      const totalElements = float32Array.length;
      const vectorDim = 1536; // OpenAI embedding dimension
      const numVectors = Math.floor(totalElements / vectorDim);
      console.log(`${filename}: Found ${numVectors} vectors of dimension ${vectorDim}`);
      
      // Reshape the array into a 2D tensor [numVectors x vectorDim]
      const reshapedArray = [];
      for (let i = 0; i < numVectors; i++) {
        reshapedArray.push(
          Array.from(float32Array.slice(i * vectorDim, (i + 1) * vectorDim))
        );
      }
      
      vectors[key] = tensor2d(reshapedArray);
      console.log(`Successfully loaded ${key} vectors`);
    }

    vectors.metadata = metadata;
    console.log('All vector data loaded successfully');
    
    // Cache the loaded data
    vectorDataCache = vectors;
    return vectors;
  } catch (error) {
    console.error('Error loading vector data:', error);
    throw new Error('Failed to load location data. Please try again later.');
  }
};

// Parse CSV to array of objects
const extractCoordinatesFromUrl = (url) => {
  try {
    const match = url.match(/location=([^&]+)/);
    if (match) {
      const [lat, lng] = match[1].split(',').map(coord => parseFloat(coord.trim()));
      return { latitude: lat, longitude: lng };
    }
  } catch (error) {
    console.error('Error extracting coordinates from URL:', error);
  }
  return null;
};

const parseCSV = (csv) => {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  console.log('CSV Headers:', headers);

  const parsed = lines.slice(1).map(line => {
    // Handle potential quoted values with commas inside
    const values = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    // Create the object with basic fields
    const obj = headers.reduce((obj, header, i) => {
      // Remove any surrounding quotes
      const value = values[i]?.replace(/^"|"$/g, '') || '';
      obj[header] = value;
      return obj;
    }, {});

    // Extract coordinates from the URL if present
    if (obj.image_url) {
      const coords = extractCoordinatesFromUrl(obj.image_url);
      if (coords) {
        obj.latitude = coords.latitude;
        obj.longitude = coords.longitude;
      }
    }

    return obj;
  });

  // Log a sample entry
  console.log('Sample metadata entry:', parsed[0]);
  
  return parsed;
};

// Calculate cosine similarity between query vector and all vectors in a matrix
const batchCosineSimilarity = (queryVector, vectorMatrix) => {
  // Ensure query vector is 2D [1 x dim]
  const query = queryVector.reshape([1, -1]);
  
  // Calculate dot products between query and all vectors
  const dotProducts = query.matMul(vectorMatrix.transpose());
  
  // Calculate norms
  const queryNorm = query.norm();
  const vectorNorms = vectorMatrix.norm('euclidean', 1);
  
  // Calculate similarities
  const similarities = dotProducts.div(queryNorm.mul(vectorNorms));
  
  return similarities.arraySync()[0]; // Return as regular array
};

// Search through vectors using cosine similarity
const searchVectors = async (queryEmbedding, topK = 10) => {
  try {
    console.log('Starting vector search with embedding of length:', queryEmbedding.length);
    
    const vectors = await loadVectorData();
    console.log('Vector data loaded, creating query tensor...');
    
    const queryTensor = tensor2d([queryEmbedding]);
    
    // Calculate similarities with each type of vector
    const similarities = {};
    for (const key of ['aesthetics', 'architecture', 'color', 'mood']) {
      similarities[key] = batchCosineSimilarity(queryTensor, vectors[key]);
    }
    
    // Combine similarities with weights
    const combinedScores = similarities.aesthetics.map((score, idx) => ({
      index: idx,
      score: (
        score * 0.3 + 
        similarities.architecture[idx] * 0.3 +
        similarities.color[idx] * 0.2 +
        similarities.mood[idx] * 0.2
      )
    }));
    
    // Sort by score and get top K results
    const topResults = combinedScores
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
      
    // Get metadata for top results
    const results = topResults.map(result => {
      const metadata = vectors.metadata[result.index];
      
      // Extract coordinates from the Street View URL if present
      let coordinates = null;
      if (metadata.image_url) {
        const coords = extractCoordinatesFromUrl(metadata.image_url);
        if (coords) {
          coordinates = `${coords.latitude},${coords.longitude}`;
        }
      }

      return {
        ...metadata,
        score: result.score,
        Name: metadata.name || 'Location from Street View',
        // For map markers and Street View URL generation
        Coordinates: coordinates || '0,0',
        // For displaying the static facade image
        ImageUrl: metadata.public_url || null,
        // Keep the Street View URL for redirection
        StreetViewUrl: metadata.image_url || null,
        // Keep the raw description for vector search purposes only
        searchDescription: metadata.description || metadata.colors || metadata.aesthetics || metadata.architecture
      };
    });
    
    return results;
  } catch (error) {
    console.error('Error during vector search:', error);
    throw new Error('Search failed. Please try again.');
  }
};

export { searchVectors }; 