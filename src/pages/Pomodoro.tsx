import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getPomodoroSettings, setPomodoroSettings, type PomodoroSettings } from "@/lib/storage";
import { toast } from "sonner";

type Phase = 'focus' | 'shortBreak' | 'longBreak';

const Pomodoro = () => {
  const [settings, setSettings] = useState<PomodoroSettings>(getPomodoroSettings());
  const [phase, setPhase] = useState<Phase>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const intervalRef = useRef<number>();

  const phaseConfig = {
    focus: { duration: settings.focusDuration, label: 'Focus Time', emoji: '🎯' },
    shortBreak: { duration: settings.shortBreakDuration, label: 'Short Break', emoji: '☕' },
    longBreak: { duration: settings.longBreakDuration, label: 'Long Break', emoji: '🌸' },
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handlePhaseComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handlePhaseComplete = () => {
    setIsRunning(false);
    
    if (phase === 'focus') {
      const newCompletedCycles = completedCycles + 1;
      setCompletedCycles(newCompletedCycles);
      
      if (newCompletedCycles % settings.cyclesUntilLongBreak === 0) {
        setPhase('longBreak');
        setTimeLeft(settings.longBreakDuration * 60);
        toast.success("Amazing work! Time for a long break 🌸", {
          description: "You've earned it!",
        });
      } else {
        setPhase('shortBreak');
        setTimeLeft(settings.shortBreakDuration * 60);
        toast.success("Great focus session! Take a quick break ☕");
      }
    } else {
      setPhase('focus');
      setTimeLeft(settings.focusDuration * 60);
      toast.info("Break's over! Ready to focus? 🎯", {
        description: "You've got this, Sher!",
      });
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(phaseConfig[phase].duration * 60);
  };

  const handleSettingsSave = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    setPomodoroSettings(newSettings);
    setSettingsOpen(false);
    toast.success("Settings saved!");
    
    // Reset timer to new duration if not running
    if (!isRunning) {
      setTimeLeft(newSettings.focusDuration * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((phaseConfig[phase].duration * 60 - timeLeft) / (phaseConfig[phase].duration * 60)) * 100;

  return (
    <div className="container max-w-2xl px-4 py-8">
      <Card className="shadow-pink border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-heading flex items-center justify-center gap-2">
            {phaseConfig[phase].emoji} {phaseConfig[phase].label}
          </CardTitle>
          <CardDescription>
            Cycle {completedCycles + 1} • Stay focused and productive
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className="text-7xl md:text-8xl font-heading font-bold gradient-pink bg-clip-text text-transparent">
              {formatTime(timeLeft)}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full gradient-pink transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="pill"
              size="lg"
              onClick={toggleTimer}
              className="text-lg"
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Start
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={resetTimer}
            >
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>

            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                  <SettingsIcon className="h-5 w-5" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Pomodoro Settings</DialogTitle>
                </DialogHeader>
                <PomodoroSettingsForm 
                  settings={settings} 
                  onSave={handleSettingsSave}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{completedCycles}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {settings.cyclesUntilLongBreak - (completedCycles % settings.cyclesUntilLongBreak)}
              </div>
              <div className="text-xs text-muted-foreground">Until Long Break</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.floor(completedCycles * settings.focusDuration / 60)}h
              </div>
              <div className="text-xs text-muted-foreground">Total Focus</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PomodoroSettingsForm = ({ 
  settings, 
  onSave 
}: { 
  settings: PomodoroSettings; 
  onSave: (settings: PomodoroSettings) => void;
}) => {
  const [localSettings, setLocalSettings] = useState(settings);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="focus">Focus Duration (minutes)</Label>
        <Input
          id="focus"
          type="number"
          min="1"
          max="60"
          value={localSettings.focusDuration}
          onChange={(e) => setLocalSettings({ ...localSettings, focusDuration: parseInt(e.target.value) || 25 })}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="short">Short Break (minutes)</Label>
        <Input
          id="short"
          type="number"
          min="1"
          max="30"
          value={localSettings.shortBreakDuration}
          onChange={(e) => setLocalSettings({ ...localSettings, shortBreakDuration: parseInt(e.target.value) || 5 })}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="long">Long Break (minutes)</Label>
        <Input
          id="long"
          type="number"
          min="1"
          max="60"
          value={localSettings.longBreakDuration}
          onChange={(e) => setLocalSettings({ ...localSettings, longBreakDuration: parseInt(e.target.value) || 15 })}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cycles">Cycles Until Long Break</Label>
        <Input
          id="cycles"
          type="number"
          min="2"
          max="10"
          value={localSettings.cyclesUntilLongBreak}
          onChange={(e) => setLocalSettings({ ...localSettings, cyclesUntilLongBreak: parseInt(e.target.value) || 4 })}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="audio">Audio Notifications</Label>
        <Switch
          id="audio"
          checked={localSettings.audioEnabled}
          onCheckedChange={(checked) => setLocalSettings({ ...localSettings, audioEnabled: checked })}
        />
      </div>
      
      <Button 
        variant="pill" 
        className="w-full"
        onClick={() => onSave(localSettings)}
      >
        Save Settings
      </Button>
    </div>
  );
};

export default Pomodoro;
