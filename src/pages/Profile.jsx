
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  CreditCard, 
  FolderPlus, 
  Trash2, 
  Edit, 
  Crown, 
  Mail,
  Lock,
  LogOut,
  Plus,
  MapPin
} from "lucide-react";
import { MainNav } from "@/components/layout/MainNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationDetail } from "@/components/search/LocationDetail";

export function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditPayment, setShowEditPayment] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Get user data from localStorage with proper error handling
  const userData = (() => {
    try {
      const data = JSON.parse(localStorage.getItem("userData") || "{}");
      return {
        ...data,
        savedLocations: Array.isArray(data.savedLocations) ? data.savedLocations : []
      };
    } catch (error) {
      console.error('Error parsing userData:', error);
      return { savedLocations: [] };
    }
  })();

  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    subscription: userData.tier || "free",
    savedLocations: userData.savedLocations || []
  });

  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: "•••• •••• •••• 4242",
    expiryDate: "12/25",
    cardType: "Visa"
  });

  // Initialize folders state with saved locations and proper error handling
  const [folders, setFolders] = useState(() => {
    try {
      const savedLocations = userData.savedLocations || [];
      if (savedLocations.length > 0) {
        return [{
          id: 1,
          name: "My Locations",
          locations: savedLocations.map(location => ({
            id: location.id || Date.now(),
            name: location.address ? location.address.split(',')[0] : "Unnamed Location",
            address: location.address || "Address unavailable",
            coordinates: location.Coordinates || "Coordinates unavailable",
            distance: location.distance || null,
            Image_url: location.Image_url || null
          }))
        }];
      }
      return [];
    } catch (error) {
      console.error('Error initializing folders:', error);
      return [];
    }
  });

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Folder name required",
        description: "Please enter a name for your folder",
        variant: "destructive"
      });
      return;
    }

    setFolders(prev => [...prev, {
      id: Date.now(),
      name: newFolderName,
      locations: []
    }]);

    setNewFolderName("");
    setShowCreateFolder(false);
    toast({
      title: "Folder created",
      description: "Your new folder has been created successfully"
    });
  };

  const handleDeleteFolder = (folderId) => {
    setFolders(prev => prev.filter(folder => folder.id !== folderId));
    toast({
      title: "Folder deleted",
      description: "The folder and its contents have been removed"
    });
  };

  const handleDeleteLocation = (folderId, locationId) => {
    try {
      // Update folders state
      setFolders(prev => prev.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            locations: folder.locations.filter(loc => loc.id !== locationId)
          };
        }
        return folder;
      }));

      // Update localStorage
      const updatedLocations = userProfile.savedLocations.filter(loc => loc.id !== locationId);
      const updatedUserData = { ...userData, savedLocations: updatedLocations };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));

      toast({
        title: "Location removed",
        description: "The location has been removed from your saved locations"
      });
    } catch (error) {
      console.error('Error deleting location:', error);
      toast({
        title: "Error",
        description: "Failed to remove location. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLocationClick = (location, e) => {
    e.stopPropagation();
    setSelectedLocation(location);
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setShowEditProfile(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully"
    });
  };

  const handleUpdatePayment = (e) => {
    e.preventDefault();
    setShowEditPayment(false);
    toast({
      title: "Payment method updated",
      description: "Your payment information has been updated successfully"
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match",
        variant: "destructive"
      });
      return;
    }

    setShowChangePassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully"
    });
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Subscription cancelled",
      description: "Your subscription will end at the end of the billing period"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Profile Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                <p className="text-muted-foreground">{userProfile.email}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowEditProfile(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {/* Subscription Status */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">
                    {userProfile.subscription === "pro" ? "LocScout Pro" : 
                     userProfile.subscription === "plus" ? "LocScout+" : 
                     "Free Plan"}
                  </h2>
                  <p className="text-muted-foreground">
                    {userProfile.subscription === "free" ? 
                      "Upgrade to unlock premium features" : 
                      "You have access to all premium features"}
                  </p>
                </div>
                {userProfile.subscription === "free" ? (
                  <Button onClick={() => navigate("/pricing")}>
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={handleCancelSubscription}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="locations" className="space-y-4">
              <TabsList>
                <TabsTrigger value="locations">Saved Locations</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="locations" className="space-y-4">
                {/* Folders */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">My Folders</h2>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateFolder(true)}
                    >
                      <FolderPlus className="h-4 w-4 mr-2" />
                      New Folder
                    </Button>
                  </div>

                  {folders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FolderPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No folders yet</p>
                      <Button
                        variant="link"
                        onClick={() => setShowCreateFolder(true)}
                      >
                        Create your first folder
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {folders.map(folder => (
                        <div
                          key={folder.id}
                          className="border rounded-lg p-4 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{folder.name}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteFolder(folder.id)}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>

                          {folder.locations.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No locations in this folder
                            </p>
                          ) : (
                            <div className="grid gap-4">
                              {folder.locations.map(location => (
                                <div
                                  key={location.id}
                                  className="flex items-start justify-between p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors cursor-pointer"
                                  onClick={(e) => handleLocationClick(location, e)}
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      <p className="font-medium">{location.name}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {location.address}
                                    </p>
                                    {location.distance && (
                                      <p className="text-sm text-muted-foreground">
                                        {location.distance.toFixed(1)} miles away
                                      </p>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteLocation(folder.id, location.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                {/* Account Settings */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Account Settings</h2>
                  
                  <div className="space-y-4">
                    {/* Email */}
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">Email Address</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {userProfile.email}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowEditProfile(true)}
                      >
                        Change
                      </Button>
                    </div>

                    {/* Password */}
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">Password</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ••••••••••••
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowChangePassword(true)}
                      >
                        Change
                      </Button>
                    </div>

                    {/* Payment Method */}
                    {userProfile.subscription !== "free" && (
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium">Payment Method</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {paymentMethod.cardType} ending in {paymentMethod.cardNumber.slice(-4)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires {paymentMethod.expiryDate}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setShowEditPayment(true)}
                        >
                          Update
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={userProfile.name}
                onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userProfile.email}
                onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
              />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Dialog */}
      <Dialog open={showEditPayment} onOpenChange={setShowEditPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Method</DialogTitle>
            <DialogDescription>
              Update your payment information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdatePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                />
              </div>
            </div>
            <Button type="submit">Update Payment Method</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for your new folder
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleCreateFolder(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="My Favorite Locations"
              />
            </div>
            <Button type="submit">Create Folder</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>
            <Button type="submit">Change Password</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Location Detail Dialog */}
      {selectedLocation && (
        <LocationDetail
          location={selectedLocation}
          open={!!selectedLocation}
          onOpenChange={(open) => !open && setSelectedLocation(null)}
        />
      )}
    </div>
  );
}
