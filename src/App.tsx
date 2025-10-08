import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import Pomodoro from "./pages/Pomodoro";
import AnimePicker from "./pages/AnimePicker";
import Library from "./pages/Library";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Moments from "./pages/Moments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <Routes>
            <Route path="/hbd-sher" element={<Dashboard />} />
            <Route path="/hbd-sher/pomodoro" element={<Pomodoro />} />
            <Route path="/hbd-sher/anime-picker" element={<AnimePicker />} />
            <Route path="/hbd-sher/library" element={<Library />} />
            <Route path="/hbd-sher/moments" element={<Moments />} />
            <Route path="/hbd-sher/settings" element={<Settings />} />
            <Route path="/hbd-sher/about" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
