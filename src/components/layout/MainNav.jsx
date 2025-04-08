
import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Crown, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function MainNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  const handleNavigation = (path) => {
    // Reset any search results when navigating home
    if (path === "/search") {
      // Clear any stored search state
      localStorage.removeItem("lastSearch");
      // Force a page reload when going to search
      window.location.href = "/search";
    } else {
      navigate(path);
    }
  };

  return (
    <header className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-50">
      <nav className="px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => handleNavigation("/search")}>
                  Home
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation("/how-it-works")}>
                  How It Works
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation("/pricing")}>
                  Plans
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation("/about")}>
                  About Us
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation("/contact")}>
                  Contact
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation("/blog")}>
                  Blog
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation("/privacy")}>
                  Privacy Policy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation("/terms")}>
                  Terms & Conditions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <img
              src="https://storage.googleapis.com/hostinger-horizons-assets-prod/5824771b-400a-4227-a9e8-9f8794985cfc/b94a0cf74e0fbbc0a19df26f365d0277.png"
              alt="LocScout"
              className="h-3 cursor-pointer"
              onClick={() => handleNavigation("/search")}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="hidden sm:flex items-center gap-2"
              onClick={() => handleNavigation("/pricing")}
            >
              <Crown className="h-4 w-4" />
              Upgrade
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigation("/profile")}
              className="mr-2"
            >
              <User className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
