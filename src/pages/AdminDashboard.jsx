
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MainNav } from "@/components/layout/MainNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenLine, Image, Eye, Plus, Edit, Trash2, FileText } from "lucide-react";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    coverImage: null
  });
  const [posts, setPosts] = useState(() => {
    // Get posts from localStorage
    const savedPosts = localStorage.getItem("blogPosts");
    return savedPosts ? JSON.parse(savedPosts) : [];
  });
  const [previewMode, setPreviewMode] = useState(false);

  // Check if user is admin
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const isAdmin = userData.isAdmin;

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
    }
  }, [isAdmin, navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost(prev => ({
          ...prev,
          coverImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    if (!newPost.title || !newPost.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const post = {
      id: Date.now(),
      ...newPost,
      author: "LocScout Team",
      date: new Date().toLocaleDateString(),
      published: true
    };

    const updatedPosts = [...posts, post];
    setPosts(updatedPosts);
    localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));

    setNewPost({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      coverImage: null
    });

    toast({
      title: "Post Published",
      description: "Your blog post has been published successfully."
    });
  };

  const handleDelete = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));

    toast({
      title: "Post Deleted",
      description: "The blog post has been deleted successfully."
    });
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your blog posts and content
            </p>
          </motion.div>

          <Tabs defaultValue="new-post" className="space-y-6">
            <TabsList>
              <TabsTrigger value="new-post">New Post</TabsTrigger>
              <TabsTrigger value="manage-posts">Manage Posts</TabsTrigger>
            </TabsList>

            <TabsContent value="new-post" className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Post Title</Label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter post title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Photography, Tips & Tricks"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Input
                    id="excerpt"
                    value={newPost.excerpt}
                    onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of the post"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full min-h-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Write your blog post content here..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Cover Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1"
                    />
                    {newPost.coverImage && (
                      <img
                        src={newPost.coverImage}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button onClick={handlePublish} className="flex items-center gap-2">
                    <PenLine className="w-4 h-4" />
                    Publish Post
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {previewMode ? "Edit Mode" : "Preview"}
                  </Button>
                </div>

                {previewMode && (
                  <div className="border rounded-lg p-6 space-y-4">
                    <h2 className="text-2xl font-bold">{newPost.title || "Post Title"}</h2>
                    {newPost.coverImage && (
                      <img
                        src={newPost.coverImage}
                        alt={newPost.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{newPost.category || "Category"}</span>
                      <span>•</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <p className="text-muted-foreground">{newPost.excerpt || "Post excerpt"}</p>
                    <div className="prose max-w-none">
                      {newPost.content || "Post content"}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="manage-posts">
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No blog posts yet. Create your first post!</p>
                    <Button
                      variant="outline"
                      onClick={() => document.querySelector('[value="new-post"]').click()}
                      className="mt-4"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Post
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {posts.map(post => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-start gap-6 p-4 border rounded-lg"
                      >
                        {post.coverImage && (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-32 h-32 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1 space-y-2">
                          <h3 className="text-xl font-semibold">{post.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{post.category}</span>
                            <span>•</span>
                            <span>{post.date}</span>
                          </div>
                          <p className="text-muted-foreground">{post.excerpt}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setNewPost(post);
                              document.querySelector('[value="new-post"]').click();
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
