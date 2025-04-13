import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import numpy from 'numpy-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../LocScout_Data_Backup');
const targetDir = path.join(__dirname, '../public/data');

// Ensure source directory exists
if (!fs.existsSync(sourceDir)) {
  console.error(`Source directory ${sourceDir} does not exist!`);
  process.exit(1);
}

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  console.log(`Creating target directory ${targetDir}`);
  fs.mkdirSync(targetDir, { recursive: true });
}

async function convertNpyToJson(filename) {
  const sourcePath = path.join(sourceDir, filename);
  const targetPath = path.join(targetDir, filename.replace('.npy', '.json'));
  
  console.log(`Converting ${filename} to JSON...`);
  
  try {
    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Source file ${sourcePath} does not exist!`);
    }
    
    const npyData = fs.readFileSync(sourcePath);
    const array = numpy.parse(npyData);
    const jsonData = JSON.stringify(Array.from(array.data));
    
    fs.writeFileSync(targetPath, jsonData);
    console.log(`Successfully converted ${filename} to JSON`);
  } catch (error) {
    console.error(`Error converting ${filename}:`, error);
    throw error; // Rethrow to handle in main function
  }
}

// Convert all .npy files
async function convertAllFiles() {
  try {
    console.log('Starting conversion process...');
    
    const files = fs.readdirSync(sourceDir);
    const npyFiles = files.filter(file => file.endsWith('.npy'));
    
    if (npyFiles.length === 0) {
      throw new Error('No .npy files found in source directory!');
    }
    
    console.log(`Found ${npyFiles.length} .npy files to convert`);
    
    for (const file of npyFiles) {
      await convertNpyToJson(file);
    }
    
    // Copy the metadata CSV file
    const metadataSource = path.join(sourceDir, 'metadata_with_coordinates.csv');
    const metadataTarget = path.join(targetDir, 'metadata_with_coordinates.csv');
    
    if (!fs.existsSync(metadataSource)) {
      throw new Error('Metadata file not found!');
    }
    
    fs.copyFileSync(metadataSource, metadataTarget);
    console.log('Successfully copied metadata file');
    
    // Verify all files were created
    const expectedFiles = [
      ...npyFiles.map(f => f.replace('.npy', '.json')),
      'metadata_with_coordinates.csv'
    ];
    
    const missingFiles = expectedFiles.filter(f => !fs.existsSync(path.join(targetDir, f)));
    if (missingFiles.length > 0) {
      throw new Error(`Missing output files: ${missingFiles.join(', ')}`);
    }
    
    console.log('All files converted and verified successfully!');
  } catch (error) {
    console.error('Conversion failed:', error);
    process.exit(1);
  }
}

convertAllFiles(); 