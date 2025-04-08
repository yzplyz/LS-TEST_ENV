
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { useToast } from "./components/ui/use-toast";
import { Toaster } from "./components/ui/toaster";
import { SearchInterface } from "./components/search/SearchInterface";
import { PricingPlans } from "./components/subscription/PricingPlans";
import { AuthDialog } from "./components/auth/AuthDialog";
import { PasswordProtection } from "./components/auth/PasswordProtection";
import { HowItWorks } from "./pages/HowItWorks";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Blog } from "./pages/Blog";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { Profile } from "./pages/Profile";
import { StreetView } from "./pages/StreetView";

function LandingPage({ onGetStarted }) {
  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="w-[150px] md:w-[400px] mx-auto mb-8">
          <img
            src="https://storage.googleapis.com/hostinger-horizons-assets-prod/5824771b-400a-4227-a9e8-9f8794985cfc/2bc5cac8f84eb5c17fbb853f3630d948.png"
            alt="LocScout"
            className="w-full"
          />
        </div>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
          Discover perfect locations for your next photo or film shoot
        </p>
        <Button
          onClick={onGetStarted}
          className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
        >
          Get Started
        </Button>
      </motion.div>
    </div>
  );
}

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const { toast } = useToast();
  
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    toast({
      title: "Welcome to LocScout!",
      description: "Start discovering perfect locations.",
    });
  };

  return (
    <PasswordProtection>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/search" replace />
              ) : (
                <LandingPage onGetStarted={handleGetStarted} />
              )
            }
          />
          <Route
            path="/search"
            element={
              isAuthenticated ? (
                <SearchInterface />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/pricing"
            element={
              isAuthenticated ? (
                <PricingPlans />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/how-it-works"
            element={
              isAuthenticated ? (
                <HowItWorks />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/about"
            element={
              isAuthenticated ? (
                <About />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/contact"
            element={
              isAuthenticated ? (
                <Contact />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/blog"
            element={
              isAuthenticated ? (
                <Blog />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/privacy"
            element={
              isAuthenticated ? (
                <Privacy />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/terms"
            element={
              isAuthenticated ? (
                <Terms />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <Profile />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/street-view"
            element={
              isAuthenticated ? (
                <StreetView />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>

        <AuthDialog 
          open={showAuth} 
          onOpenChange={setShowAuth}
          onSuccess={handleAuthSuccess}
        />
        <Toaster />
      </Router>
    </PasswordProtection>
  );
}

export default App;
