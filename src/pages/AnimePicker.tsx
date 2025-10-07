import { useState, useEffect } from "react";
import { Plus, Trash2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getAnimeList, setAnimeList, type AnimeItem } from "@/lib/storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AnimePicker = () => {
  const [animeList, setAnimeListState] = useState<AnimeItem[]>([]);
  const [newAnime, setNewAnime] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<AnimeItem | null>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setAnimeListState(getAnimeList());
  }, []);

  const saveList = (list: AnimeItem[]) => {
    setAnimeList(list);
    setAnimeListState(list);
  };

  const addAnime = () => {
    if (!newAnime.trim()) return;
    
    const anime: AnimeItem = {
      id: Date.now().toString(),
      title: newAnime.trim(),
    };
    
    const updated = [...animeList, anime];
    saveList(updated);
    setNewAnime("");
    toast.success(`Added "${anime.title}" to the wheel!`);
  };

  const removeAnime = (id: string) => {
    const updated = animeList.filter((a) => a.id !== id);
    saveList(updated);
    toast.success("Removed from wheel");
  };

  const availableAnime = animeList.filter((a) => !a.removed);

  const spinWheel = () => {
    if (availableAnime.length === 0) {
      toast.error("Add some anime first!");
      return;
    }

    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * availableAnime.length);
    const selected = availableAnime[randomIndex];
    
    // Calculate rotation - multiple full spins + landing position
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalAngle = (randomIndex / availableAnime.length) * 360;
    const totalRotation = rotation + spins * 360 + finalAngle;
    
    setRotation(totalRotation);

    setTimeout(() => {
      setSelectedAnime(selected);
      setSpinning(false);
      
      // Create confetti effect
      createConfetti();
    }, 3000);
  };

  const createConfetti = () => {
    const confettiCount = 50;
    const colors = ['#FF1493', '#FF69B4', '#FFB6D9', '#FFC0CB'];
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'fixed w-2 h-2 animate-confetti pointer-events-none z-50';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-20px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.animationDuration = 2 + Math.random() + 's';
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 3000);
    }
  };

  return (
    <div className="container max-w-4xl px-4 py-8">
      <Card className="shadow-pink border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-heading flex items-center justify-center gap-2">
            🎡 Anime Picker Wheel
          </CardTitle>
          <CardDescription>
            Can't decide what to watch? Let fate decide!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Add Anime */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter anime title..."
              value={newAnime}
              onChange={(e) => setNewAnime(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addAnime()}
              className="rounded-2xl"
            />
            <Button variant="pill" onClick={addAnime}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          {/* Wheel Visual */}
          {availableAnime.length > 0 ? (
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-primary drop-shadow-lg" />
                </div>
                
                {/* Wheel */}
                <div 
                  className={cn(
                    "w-full h-full rounded-full shadow-pink border-4 border-primary overflow-hidden",
                    spinning && "transition-transform duration-[3000ms] ease-out"
                  )}
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  {availableAnime.map((anime, index) => {
                    const angle = (360 / availableAnime.length) * index;
                    const colors = [
                      'bg-pink-400',
                      'bg-rose-400', 
                      'bg-fuchsia-400',
                      'bg-pink-500',
                      'bg-rose-500',
                      'bg-fuchsia-500',
                    ];
                    
                    return (
                      <div
                        key={anime.id}
                        className={cn(
                          "absolute w-full h-full origin-bottom left-1/2",
                          colors[index % colors.length]
                        )}
                        style={{
                          transform: `rotate(${angle}deg) translateX(-50%)`,
                          clipPath: `polygon(50% 100%, ${50 - 50 * Math.sin((Math.PI * 2) / availableAnime.length / 2)}% 0%, ${50 + 50 * Math.sin((Math.PI * 2) / availableAnime.length / 2)}% 0%)`,
                        }}
                      >
                        <div 
                          className="absolute top-8 left-1/2 -translate-x-1/2 text-xs md:text-sm font-medium text-white text-center"
                          style={{ transform: 'rotate(0deg)' }}
                        >
                          {anime.title.length > 15 
                            ? anime.title.substring(0, 15) + '...' 
                            : anime.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button
                variant="pill"
                size="lg"
                onClick={spinWheel}
                disabled={spinning}
                className="text-xl px-12 py-6"
              >
                {spinning ? (
                  <>
                    <Sparkles className="h-6 w-6 animate-spin" />
                    Spinning...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-6 w-6" />
                    Spin the Wheel!
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Add anime in Settings → Data or connect AniList.</p>
              <p className="text-sm mt-2">Start by adding your first anime above! ⬆️</p>
            </div>
          )}

          {/* Anime List */}
          {availableAnime.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-heading font-semibold text-lg">Your Anime List ({availableAnime.length})</h3>
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {availableAnime.map((anime) => (
                  <div
                    key={anime.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-card border hover:border-primary/50 transition-smooth"
                  >
                    <span className="font-medium">{anime.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAnime(anime.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Modal */}
      <Dialog open={!!selectedAnime} onOpenChange={(open) => !open && setSelectedAnime(null)}>
        <DialogContent className="shadow-pink">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-center">
              🎉 Your Anime is...
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4 py-6">
            <div className="text-3xl md:text-4xl font-heading font-bold gradient-pink bg-clip-text text-transparent">
              {selectedAnime?.title}
            </div>
            <Button variant="pill" size="lg" onClick={() => setSelectedAnime(null)}>
              Awesome! 🌸
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnimePicker;
