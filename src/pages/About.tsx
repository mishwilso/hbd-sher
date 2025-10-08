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
              Sher Board is a web app built just for you! I'll be sure to add more features
              in the future, and keep showering you in gifts. I hope you have fun here and
              feel free to tell me what to add next. 💖
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-heading font-semibold text-primary">
              Features
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Anime Picker Wheel:</strong> Say goodbye to indeci..indi...in...</li>
              <li><strong>Pomodoro Timer:</strong> Your very own pomodoro timer</li>
              <li><strong>Yaoi Tier Library:</strong> A tier-list just for you</li>
              <li><strong>Data Management:</strong> Import/export if you want i guess...</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-heading font-semibold text-primary">
              Technical Details
            </h3>
            <p className="leading-relaxed">
              Built with React, TypeScript, Vite, and Tailwind CSS. All your data is stored 
              locally in your browser, so your lists and settings are private and accessible 
              anytime. I'll add cloud features in the future 🌸
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-heading font-semibold text-primary">
              Accessibility
            </h3>
            <p className="leading-relaxed">
              I love Accessibility and so should you! It includes reduced motion options for 
              those sensitive to animations, keyboard navigation support, and proper ARIA 
              labels for screen readers.
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
                For my best friend Sher — I poured every ounce of web design and web knowledge I had. I hope you like it. 💕
              </p>
              
              <div className="flex items-center justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Coffee className="h-4 w-4" />
                  <span>Powered by tears and friendship</span>
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
