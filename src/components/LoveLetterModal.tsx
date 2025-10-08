import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart } from "lucide-react";

interface LoveLetterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoveLetterModal = ({ open, onOpenChange }: LoveLetterModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto shadow-pink">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-heading">
            <Heart className="h-6 w-6 text-primary animate-pulse" />
            From Mish, With Love
            <Heart className="h-6 w-6 text-primary animate-pulse" />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-foreground/90 leading-relaxed">
          <p className="text-lg">
            Dear Sher,
          </p>
          
          <p>
Every day, I am so grateful that I dropped that pencil on the floor and that you were the person to pick it up. You’re truly the greatest friend I could have ever asked for. If I didn’t believe in soulmates before, I definitely believe in them now. 💖          </p>
          
          <p>
I built this little corner of the internet just for you (it's a mess, but I’ll clean up later) because a) I’m broke and very far away, so I can’t hug you,  b) you deserve to have a website dedicated to you. Everything I built is a sort of reference to conversations or moments we share- from deciding on what anime to watch, doing pomodoro sessions together, or the infamous yaoi library that you speak of so often. 🌸
          </p>
          
          <p>
I love you dearly and all that you bring. I love your rants, even when they’re about nothing in particular. I love how hypotheticals, no matter how improbable they are. I love laughing at and with you, even when the joke has long since passed. You make my life better in more ways than I can describe, and I hope I do the same for you.  ✨
          </p>
          
          <p>
            Thank you for being exactly who you are. Thank you for every late-night conversation, every inside joke, every moment of pure joy. You are irreplaceable, and I am so incredibly lucky to call you my best friend.
          </p>
          
          <p>
This is your space. There’s definitely more to come; my skills aren’t quite there yet. I hope you have a great time while you’re here.
          </p>
          
          <p className="text-lg font-medium">
            Love you forever and always,<br />
            Mish 💕
          </p>
          
          <p className="text-sm text-muted-foreground italic text-center pt-4">
            P.S. — You're stuck with me forever. I'll sue if you leave me. 😘
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoveLetterModal;
