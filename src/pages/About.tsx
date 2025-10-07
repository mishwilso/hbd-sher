import { Heart, Github, Coffee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container max-w-3xl px-4 py-8">
      <Card className="shadow-pink border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-heading flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            About Sher Board
            <Heart className="h-8 w-8 text-primary" />
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-foreground/90">
          <section className="space-y-2">
            <h3 className="text-xl font-heading font-semibold text-primary">
              What is this?
            </h3>
            <p className="leading-relaxed">
              Sher Board is a custom-built web app that combines productivity tools with anime 
              fandom fun. It's designed specifically for one very special person who deserves 
              a space that's as unique as they are. 💖
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-heading font-semibold text-primary">
              Features
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Anime Picker Wheel:</strong> Can't decide what to watch? Spin the wheel!</li>
              <li><strong>Pomodoro Timer:</strong> Focus mode with customizable work/break intervals</li>
              <li><strong>Yaoi Tier Library:</strong> Organize your collection from S-tier to F-tier</li>
              <li><strong>Data Management:</strong> Import/export your data to keep it safe</li>
              <li><strong>Personalized:</strong> A special letter just for you ✉️</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-heading font-semibold text-primary">
              Technical Details
            </h3>
            <p className="leading-relaxed">
              Built with React, TypeScript, Vite, and Tailwind CSS. All your data is stored 
              locally in your browser, so your lists and settings are private and accessible 
              anytime. The design system uses a carefully crafted pink color palette because, 
              well, obviously. 🌸
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-heading font-semibold text-primary">
              Accessibility
            </h3>
            <p className="leading-relaxed">
              Sher Board respects your preferences! It includes reduced motion options for 
              those sensitive to animations, keyboard navigation support, and proper ARIA 
              labels for screen readers. Everyone deserves a good experience.
            </p>
          </section>

          <div className="pt-6 border-t border-border">
            <div className="text-center space-y-4">
              <p className="text-lg font-heading">
                Made with{" "}
                <Heart className="inline h-5 w-5 text-primary animate-pulse" />{" "}
                by Mish
              </p>
              <p className="text-sm text-muted-foreground italic">
                For my best friend Sher — the pink to my aesthetic, the anime to my weekends, 
                and the reason I learned React drag-and-drop libraries. 💕
              </p>
              
              <div className="flex items-center justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Coffee className="h-4 w-4" />
                  <span>Powered by caffeine and friendship</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
