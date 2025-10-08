import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getAnimeList, setAnimeList, type AnimeItem } from "@/lib/storage";
import { toast } from "sonner";

const AnimePicker = () => {
  const [animeList, setAnimeListState] = useState<AnimeItem[]>([]);
  const [newAnime, setNewAnime] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<AnimeItem | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentAngleRef = useRef(0);

  useEffect(() => {
    setAnimeListState(getAnimeList());
  }, []);

  useEffect(() => {
    renderWheel();
  }, [animeList]);

  const renderWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const available = availableAnime;
    const wheelSize = canvas.width;
    const center = wheelSize / 2;
    const radius = center - 20;

    ctx.clearRect(0, 0, wheelSize, wheelSize);

    if (available.length === 0) {
      // Draw empty wheel
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFE5F1';
      ctx.fill();
      ctx.strokeStyle = '#FF69B4';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#FF1493';
      ctx.font = 'bold 18px Quicksand';
      ctx.textAlign = 'center';
      ctx.fillText('Add anime to spin!', center, center);
      return;
    }

    const colors = ['#FF69B4', '#FFB6D9', '#FF1493', '#FFC0CB', '#FF85C1', '#FFD5E5'];
    const segmentAngle = (2 * Math.PI) / available.length;

    // Draw segments
    for (let i = 0; i < available.length; i++) {
      const startAngle = i * segmentAngle + currentAngleRef.current;
      const endAngle = (i + 1) * segmentAngle + currentAngleRef.current;

      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.min(16, radius / 6)}px Quicksand`;

      const maxTextWidth = radius * 0.65;
      let displayText = available[i].title;
      let textWidth = ctx.measureText(displayText).width;

      while (textWidth > maxTextWidth && displayText.length > 3) {
        displayText = displayText.substring(0, displayText.length - 1);
        textWidth = ctx.measureText(displayText + '...').width;
      }

      if (displayText.length < available[i].title.length) {
        displayText += '...';
      }

      ctx.fillText(displayText, radius - 15, 5);
      ctx.restore();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(center, center, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

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
    
    const spinDuration = 3000;
    const startTime = performance.now();
    const rotations = 5 + Math.random() * 3;
    
    const segmentAngle = (2 * Math.PI) / availableAnime.length;
    const winningSegment = Math.floor(Math.random() * availableAnime.length);
    const targetAngle = currentAngleRef.current + (rotations * 2 * Math.PI) + (winningSegment * segmentAngle);
    const initialAngle = currentAngleRef.current;
    
    const animateSpin = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentAngleRef.current = initialAngle + (easeOut * (targetAngle - initialAngle));
      
      renderWheel();
      
      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        setSelectedAnime(availableAnime[winningSegment]);
        setSpinning(false);
        createConfetti();
      }
    };
    
    requestAnimationFrame(animateSpin);
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
            Let fate decide our future!!!
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
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-primary drop-shadow-lg" />
              </div>
              
              {/* Canvas Wheel */}
              <canvas
                ref={canvasRef}
                width={384}
                height={384}
                className="w-full h-full rounded-full shadow-pink"
              />
            </div>

            <Button
              variant="pill"
              size="lg"
              onClick={spinWheel}
              disabled={spinning || availableAnime.length === 0}
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
            <div className="text-3xl font-bold leading-tight bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
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
