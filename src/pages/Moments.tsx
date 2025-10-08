import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const moments = [
  {
    id: 1,
    quote: "You can't teach the small lunged to float 🌸",
    image: "/public/sher_imgs/sher_1.jpg"
  },
  {
    id: 2,
    quote: "I think we were meant to make a heart…💖",
    image: "/public/sher_imgs/sher_2.jpg"
  },
  {
    id: 3,
    quote: "Two heads combine to none, quick maths 🌟",
    image: "/public/sher_imgs/sher_3.jpg"
  },
  {
    id: 4,
    quote: "Im running out of words ✨",
    image: "/public/sher_imgs/sher_4.jpg"
  },
  {
    id: 5,
    quote: "When did i become your hair stylist 🌺",
    image: "/public/sher_imgs/sher_5.jpg"
  },
  {
    id: 6,
    quote: "Fingers longer than the *something long* 💕",
    image: "/public/sher_imgs/sher_6.jpg"
  },
  {
    id: 7,
    quote: "SMILE BIGGER GODDAMN IT 🌈",
    image: "/public/sher_imgs/sher_7.jpg"
  },
  {
    id: 8,
    quote: "o kay- well not bigger than me… 😊",
    image: "/public/sher_imgs/sher_8.jpg"
  },
  {
    id: 9,
    quote: "Come back to dc 🤗",
    image: "/public/sher_imgs/sher_9.jpg"
  },
  {
    id: 10,
    quote: "First of many mirror pics 🎉",
    image: "/public/sher_imgs/sher_10.jpg"
  },
  {
    id: 11,
    quote: "WE ARE SO CUTE 🔥",
    image: "/public/sher_imgs/sher_11.jpg"
  },
  {
    id: 12,
    quote: "I still have that shirt! 💝",
    image: "/public/sher_imgs/sher_12.jpg"
  },
  {
    id: 13,
    quote: "💪",
    image: "/public/sher_imgs/sher_13.jpg"
  },
  {
    id: 14,
    quote: "Why do you hate me? 🦋",
    image: "/public/sher_imgs/sher_14.jpg"
  },
  {
    id: 15,
    quote: "What a view… 🌸💖",
    image: "/public/sher_imgs/sher_15.jpg"
  }
];

const Moments = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % moments.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + moments.length) % moments.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % moments.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentMoment = moments[currentIndex];

  return (
    <div className="container max-w-4xl px-4 py-8">
      <Card className="shadow-pink border-2 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {/* Image */}
            <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-gradient-subtle">
              <img
                src={currentMoment.image}
                alt={`Moment ${currentIndex + 1}`}
                className="w-full h-full object-cover animate-fade-in"
                key={currentMoment.id}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            {/* Quote Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="text-white text-xl md:text-3xl font-heading text-center drop-shadow-lg animate-fade-in">
                {currentMoment.quote}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                className="rounded-full bg-white/90 hover:bg-white border-2 border-primary shadow-pink h-12 w-12"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="rounded-full bg-white/90 hover:bg-white border-2 border-primary shadow-pink h-12 w-12"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground font-medium">
                {currentIndex + 1} of {moments.length}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlayPause}
                className="gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Play
                  </>
                )}
              </Button>
            </div>

            {/* Dots Indicator */}
            <div className="flex items-center justify-center gap-2">
              {moments.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted hover:bg-primary/50"
                  }`}
                  aria-label={`Go to moment ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-6 text-muted-foreground">
        <p className="text-sm">A page of memories!!! :)</p>
      </div>
    </div>
  );
};

export default Moments;
