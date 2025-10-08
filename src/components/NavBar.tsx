import { Link, useLocation } from "react-router-dom";
import { Home, Timer, Sparkles, BookHeart, Settings, Info, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/pomodoro", icon: Timer, label: "Pomodoro" },
    { path: "/anime-picker", icon: Sparkles, label: "Anime" },
    { path: "/library", icon: BookHeart, label: "Library" },
    { path: "/moments", icon: Heart, label: "Moments" },
    { path: "/settings", icon: Settings, label: "Settings" },
    { path: "/about", icon: Info, label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">💖</span>
          <span className="text-xl font-bold leading-tight bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Sher Board
          </span>
        </Link>
        
        <div className="ml-auto flex items-center gap-2 md:gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-pink"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
