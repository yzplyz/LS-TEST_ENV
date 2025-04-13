import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import numpy from 'numpy-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../LocScout_Data_Backup');
const publicDir = path.join(__dirname, '../public/data');

// Create public/data directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  console.log('Creating public/data directory...');
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy vector files directly to public/data
const vectorFiles = [
  'aesthetics_vectors.npy',
  'architecture_vectors.npy',
  'colors_vectors.npy',
  'mood_vibes_vectors.npy',
  'metadata_with_coordinates.csv'
];

console.log('Copying vector files...');
for (const file of vectorFiles) {
  const source = path.join(sourceDir, file);
  const target = path.join(publicDir, file.replace('.npy', '.json'));
  
  if (!fs.existsSync(source)) {
    console.error(`Source file ${file} not found!`);
    continue;
  }
  
  try {
    if (file.endsWith('.npy')) {
      // Convert NPY to JSON
      const npyData = fs.readFileSync(source);
      const array = numpy.parse(npyData);
      const jsonData = JSON.stringify(Array.from(array.data));
      fs.writeFileSync(target, jsonData);
      console.log(`Converted ${file} to JSON`);
    } else {
      // Copy CSV file as is
      fs.copyFileSync(source, target);
      console.log(`Copied ${file}`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
}

console.log('Setup complete!'); 