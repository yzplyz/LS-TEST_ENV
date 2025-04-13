import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { SearchResults } from "./SearchResults";
import { MainNav } from "@/components/layout/MainNav";
import { ChatSearch } from "./ChatSearch";
import { searchVectors } from "@/lib/vectorService";
import { searchWithAI } from "@/lib/openai";

export function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const inputRef = useRef(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    if (!query.trim()) {
      toast({
        title: "Search required",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    try {
      // Get embedding from OpenAI
      const { embedding } = await searchWithAI(query);
      
      // Search through vectors
      const results = await searchVectors(embedding);
      
      console.log("Search results:", results);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Please try again later",
        variant: "destructive",
      });
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleBack = () => {
    setSearchResults(null);
    setSearchQuery("");
  };

  const toggleSearchMode = () => {
    setIsChatMode(!isChatMode);
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
            className="w-full max-w-3xl"
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

            {/* Search Mode Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-muted rounded-lg p-1">
                <Button
                  variant={!isChatMode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setIsChatMode(false)}
                  className="relative"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant={isChatMode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setIsChatMode(true)}
                  className="relative"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              </div>
            </div>
            
            {isChatMode ? (
              <div className="bg-card border rounded-lg" style={{ height: "600px" }}>
                <ChatSearch onSearch={handleSearch} isSearching={isSearching} />
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="relative mb-4">
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
            )}
          </motion.div>
        </main>
      )}
    </div>
  );
}
