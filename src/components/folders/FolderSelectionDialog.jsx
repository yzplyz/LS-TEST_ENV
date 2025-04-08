
import React, { useState } from "react";
import { FolderPlus, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { createFolder, saveLocationToFolder } from "@/lib/folders-service";

export function FolderSelectionDialog({ 
  open, 
  onOpenChange, 
  folders = [], 
  onFolderSelect,
  onCreateFolder,
  location
}) {
  const { toast } = useToast();
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    
    if (!newFolderName.trim()) {
      toast({
        title: "Folder name required",
        description: "Please enter a name for your folder",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get current user data
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      
      // Create new folder in Supabase
      const newFolder = await createFolder(userData.id, newFolderName.trim());

      // Call the parent handler
      onCreateFolder(newFolder);
      
      // Reset state
      setNewFolderName("");
      setShowNewFolderInput(false);

      toast({
        title: "Folder created",
        description: "Your new folder has been created successfully"
      });
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderClick = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const handleSaveToFolder = async () => {
    if (!selectedFolderId) {
      toast({
        title: "Select a folder",
        description: "Please select a folder to save the location",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Save location to Supabase
      await saveLocationToFolder(selectedFolderId, location);
      
      onFolderSelect(selectedFolderId);
      
      toast({
        title: "Location saved",
        description: "Location has been saved to the selected folder"
      });
    } catch (error) {
      console.error('Error saving location:', error);
      toast({
        title: "Error",
        description: "Failed to save location. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset selected folder when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setSelectedFolderId(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save to Folder</DialogTitle>
          <DialogDescription>
            Choose a folder to save this location or create a new one
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Existing Folders */}
          {folders && folders.length > 0 && (
            <div className="space-y-2">
              <Label>Select Folder</Label>
              <div className="grid gap-2">
                {folders.map(folder => (
                  <Button
                    key={folder.id}
                    variant={selectedFolderId === folder.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleFolderClick(folder.id)}
                    disabled={isLoading}
                  >
                    <FolderPlus className="mr-2 h-4 w-4" />
                    {folder.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Create New Folder */}
          {showNewFolderInput ? (
            <form onSubmit={handleCreateFolder} className="space-y-2">
              <Label>New Folder Name</Label>
              <div className="flex gap-2">
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowNewFolderInput(true)}
              disabled={isLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Folder
            </Button>
          )}

          {/* Save Button */}
          {folders && folders.length > 0 && (
            <div className="pt-4">
              <Button 
                className="w-full"
                onClick={handleSaveToFolder}
                disabled={!selectedFolderId || isLoading}
              >
                {isLoading ? "Saving..." : "Save to Selected Folder"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
