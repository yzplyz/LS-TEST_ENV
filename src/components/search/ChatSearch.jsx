import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { searchWithAI } from "@/lib/openai";
import { searchVectors } from "@/lib/vectorService";

export function ChatSearch({ onSearch, isSearching }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    setMessages(prev => [...prev, { 
      type: "user", 
      content: userMessage 
    }]);

    setIsThinking(true);

    try {
      // Get AI response and embedding
      const { aiResponse, embedding } = await searchWithAI(userMessage);
      
      // Add AI response
      setMessages(prev => [...prev, { 
        type: "assistant", 
        content: aiResponse 
      }]);

      // Search through vectors
      const searchResults = await searchVectors(embedding);
      
      // Add results message with preview
      setMessages(prev => [...prev, {
        type: "assistant",
        content: `I found ${searchResults.length} locations that match your criteria. Here are some previews:`,
        locations: searchResults.slice(0, 3).map(location => ({
          name: location.Name,
          description: location.Description,
          imageUrl: location.ImageUrl,
          coordinates: location.Coordinates
        }))
      }]);

      // Update search results in parent component
      onSearch(searchResults);
    } catch (error) {
      console.error('Chat search error:', error);
      toast({
        title: "Search failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground p-4">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Hi! I'm your location scouting assistant.</p>
            <p className="text-sm">Tell me what kind of location you're looking for.</p>
          </div>
        )}
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-start gap-3 ${
                message.type === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}>
                {message.type === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className={`rounded-lg p-4 max-w-[80%] ${
                message.type === "user" 
                  ? "bg-primary text-primary-foreground ml-auto" 
                  : "bg-muted"
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {/* Location Previews */}
                {message.locations && (
                  <div className="mt-4 space-y-4">
                    {message.locations.map((location, idx) => (
                      <div key={idx} className="bg-background rounded-lg overflow-hidden">
                        {location.imageUrl && (
                          <img 
                            src={location.imageUrl} 
                            alt={location.name}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4" />
                            <h4 className="font-medium">{location.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {location.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {(isThinking || isSearching) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-muted rounded-lg p-4">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your ideal location..."
            className="flex-1"
            disabled={isThinking || isSearching}
          />
          <Button 
            type="submit" 
            disabled={isThinking || isSearching || !input.trim()}
          >
            {isThinking || isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
