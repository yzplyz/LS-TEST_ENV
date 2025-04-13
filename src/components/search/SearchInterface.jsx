import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import SearchResults from "./SearchResults";
import { MainNav } from "@/components/layout/MainNav";
import { SemanticSearch } from "@/lib/semanticSearch";

export function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const semanticSearch = useRef(new SemanticSearch());

  useEffect(() => {
    // Initialize the semantic search when the component mounts
    semanticSearch.current.initialize().catch(error => {
      console.error("Failed to initialize semantic search:", error);
      toast({
        title: "Initialization failed",
        description: "Could not initialize search functionality",
        variant: "destructive",
      });
    });
  }, [toast]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      toast({
        title: "Search required",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery.trim(),
          top_k: 10,
          threshold: 0.4
        }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Search response:', data);
      setSearchResults(data);
      setIsSearching(false);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Please try again later",
        variant: "destructive",
      });
      setSearchResults(null);
      setIsSearching(false);
    }
  };

  const handleBack = () => {
    setSearchResults(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />
      
      {searchResults ? (
        <SearchResults 
          results={searchResults} 
          onBack={handleBack}
          searchQuery={searchQuery}
        />
      ) : (
        <main className="flex-1 flex items-center justify-center px-4 gradient-bg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl w-full"
          >
            {/* Desktop Logo */}
            <img
              src="https://storage.googleapis.com/hostinger-horizons-assets-prod/5824771b-400a-4227-a9e8-9f8794985cfc/2bc5cac8f84eb5c17fbb853f3630d948.png"
              alt="LocScout"
              className="h-16 mx-auto mb-8 hidden md:block"
            />
            
            {/* Mobile Logo */}
            <img
              src="https://storage.googleapis.com/hostinger-horizons-assets-prod/5824771b-400a-4227-a9e8-9f8794985cfc/2bc5cac8f84eb5c17fbb853f3630d948.png"
              alt="LocScout"
              className="h-6 mx-auto mb-6 md:hidden"
            />
            
            <form onSubmit={handleSearch} className="relative mb-4">
              <Input
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe your ideal location..."
                className="w-full pl-12 pr-24 py-6 text-sm md:text-lg"
                disabled={isSearching}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </form>

            <div className="space-y-4">
              {/* Example search prompts can go here */}
            </div>
          </motion.div>
        </main>
      )}
    </div>
  );
}
