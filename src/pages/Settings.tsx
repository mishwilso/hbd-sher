import { useState, useRef } from "react";
import { Download, Upload, Moon, Sun, Volume2, VolumeX, Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { exportData, importData, getAppSettings, setAppSettings } from "@/lib/storage";
import { toast } from "sonner";

const Settings = () => {
  const [settings, setSettings] = useState(getAppSettings());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: typeof settings[K]
  ) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    setAppSettings(updated);
    toast.success("Setting updated!");
  };

  const handleExport = () => {
    exportData();
    toast.success("Data exported successfully!");
  };

  const handleImport = (merge: boolean) => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = importData(content, merge);
      
      if (success) {
        toast.success(merge ? "Data merged successfully!" : "Data imported successfully!");
        window.location.reload(); // Reload to show imported data
      } else {
        toast.error("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSetting('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="container max-w-4xl px-4 py-8">
      <Card className="shadow-pink border-2">
        <CardHeader>
          <CardTitle className="text-3xl font-heading flex items-center gap-2">
            ⚙️ Settings
          </CardTitle>
          <CardDescription>
            Customize your experience and manage your data
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Appearance */}
          <section className="space-y-4">
            <h3 className="text-xl font-heading font-semibold">Appearance</h3>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
              <div className="flex items-center gap-3">
                {settings.theme === 'light' ? (
                  <Sun className="h-5 w-5 text-primary" />
                ) : (
                  <Moon className="h-5 w-5 text-primary" />
                )}
                <div>
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    {settings.theme === 'light' ? 'Light mode' : 'Dark mode'}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </section>

          {/* Accessibility */}
          <section className="space-y-4">
            <h3 className="text-xl font-heading font-semibold">Accessibility</h3>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
              <div className="flex items-center gap-3">
                <Accessibility className="h-5 w-5 text-primary" />
                <div>
                  <Label>Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations and transitions
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
              <div className="flex items-center gap-3">
                {settings.audioEnabled ? (
                  <Volume2 className="h-5 w-5 text-primary" />
                ) : (
                  <VolumeX className="h-5 w-5 text-primary" />
                )}
                <div>
                  <Label>Audio Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sounds for timer and events
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.audioEnabled}
                onCheckedChange={(checked) => updateSetting('audioEnabled', checked)}
              />
            </div>
          </section>

          {/* Data Management */}
          <section className="space-y-4">
            <h3 className="text-xl font-heading font-semibold">Data Management</h3>
            
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-muted/30">
                <Label className="text-base mb-2 block">Export Your Data</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Download all your anime list, yaoi library, and settings as a JSON file
                </p>
                <Button variant="outline" onClick={handleExport} className="w-full">
                  <Download className="h-4 w-4" />
                  Export All Data
                </Button>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30">
                <Label className="text-base mb-2 block">Import Data</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload a previously exported JSON file to restore your data
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={() => {
                    // File selected, show import options
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleImport(false)}
                    disabled={!fileInputRef.current?.files?.[0]}
                  >
                    Replace
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleImport(true)}
                    disabled={!fileInputRef.current?.files?.[0]}
                  >
                    Merge
                  </Button>
                </div>
                {fileInputRef.current?.files?.[0] && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Selected: {fileInputRef.current.files[0].name}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Connections (Future) */}
          <section className="space-y-4 opacity-60">
            <h3 className="text-xl font-heading font-semibold">Connections</h3>
            
            <div className="p-4 rounded-2xl bg-muted/30">
              <Label className="text-base mb-2 block">MyAnimeList</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Import your Planning/Watching list directly
              </p>
              <Button variant="outline" disabled className="w-full">
                Connect MAL (Coming Soon)
              </Button>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30">
              <Label className="text-base mb-2 block">AniList</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Sync your anime list automatically
              </p>
              <Button variant="outline" disabled className="w-full">
                Connect AniList (Coming Soon)
              </Button>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
