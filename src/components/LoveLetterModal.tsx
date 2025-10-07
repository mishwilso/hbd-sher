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
            Every single day, I am grateful that the universe brought us together. You are not just my best friend—you are my person, my confidant, my partner in all things chaotic and beautiful. 💖
          </p>
          
          <p>
            I built this little corner of the internet just for you because you deserve a space as special and unique as you are. A place where you can spin for your next anime adventure, focus on your work (because you're absolutely crushing it, by the way), and organize your yaoi library like the cultured individual you are. 🌸
          </p>
          
          <p>
            I love how passionate you are about the things you care about. I love how you make me laugh until my stomach hurts. I love how you're always there when I need you, no questions asked. You make life brighter, funnier, and infinitely more pink. ✨
          </p>
          
          <p>
            Thank you for being exactly who you are. Thank you for every late-night conversation, every inside joke, every moment of pure joy. You are irreplaceable, and I am so incredibly lucky to call you my best friend.
          </p>
          
          <p>
            This is your space. Use it, break it, customize it—make it yours. Just like how you've made my life infinitely better just by being in it.
          </p>
          
          <p className="text-lg font-medium">
            Love always,<br />
            Mish 💕
          </p>
          
          <p className="text-sm text-muted-foreground italic text-center pt-4">
            P.S. — You're stuck with me forever. Sorry, I don't make the rules. 😘
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoveLetterModal;
