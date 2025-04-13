
import { supabase } from '@/lib/supabase';

export async function getFolders(userId) {
  try {
    const { data, error } = await supabase
      .from('folders')
      .select(`
        id,
        name,
        created_at,
        saved_locations (
          id,
          address,
          coordinates,
          image_url
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching folders:', error);
    // Fallback to localStorage if Supabase fails
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData.folders || [];
  }
}

export async function createFolder(userId, folderName) {
  try {
    const { data, error } = await supabase
      .from('folders')
      .insert([
        { 
          user_id: userId,
          name: folderName
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating folder:', error);
    // Fallback to localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const newFolder = {
      id: Date.now(),
      name: folderName,
      locations: []
    };
    userData.folders = [...(userData.folders || []), newFolder];
    localStorage.setItem('userData', JSON.stringify(userData));
    return newFolder;
  }
}

export async function saveLocationToFolder(folderId, location) {
  try {
    const { data, error } = await supabase
      .from('saved_locations')
      .insert([
        {
          folder_id: folderId,
          address: location.address,
          coordinates: location.Coordinates,
          image_url: location.Image_url
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving location:', error);
    // Fallback to localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const folderIndex = userData.folders.findIndex(f => f.id === folderId);
    if (folderIndex !== -1) {
      userData.folders[folderIndex].locations = [
        ...(userData.folders[folderIndex].locations || []),
        { ...location, id: Date.now() }
      ];
      localStorage.setItem('userData', JSON.stringify(userData));
      return location;
    }
    throw new Error('Folder not found');
  }
}

export async function deleteFolder(folderId) {
  try {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting folder:', error);
    // Fallback to localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.folders = userData.folders.filter(f => f.id !== folderId);
    localStorage.setItem('userData', JSON.stringify(userData));
  }
}

export async function deleteLocation(locationId) {
  try {
    const { error } = await supabase
      .from('saved_locations')
      .delete()
      .eq('id', locationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting location:', error);
    // Fallback to localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.folders = userData.folders.map(folder => ({
      ...folder,
      locations: folder.locations.filter(loc => loc.id !== locationId)
    }));
    localStorage.setItem('userData', JSON.stringify(userData));
  }
}
