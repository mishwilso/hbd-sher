import { useState } from "react";
import { Link } from "react-router-dom";
import { Timer, Disc3, Library, Settings, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoveLetterModal from "@/components/LoveLetterModal";

const Dashboard = () => {
  const [letterOpen, setLetterOpen] = useState(false);

  const features = [
    {
      to: "/pomodoro",
      icon: Timer,
      title: "Pomodoro Timer",
      description: "For all those productive nights",
      gradient: "from-pink-500 to-rose-400",
    },
    {
      to: "/anime-picker",
      icon: Disc3,
      title: "Anime Picker",
      description: "Maybe now we can decided on anime faster...",
      gradient: "from-fuchsia-500 to-pink-400",
    },
    {
      to: "/library",
      icon: Library,
      title: "Yaoi Library",
      description: "Your very own tier-list!",
      gradient: "from-pink-600 to-fuchsia-500",
    },
    {
      to: "/settings",
      icon: Settings,
      title: "Settings",
      description: "There's not much here yet...",
      gradient: "from-rose-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen">
      <main className="container max-w-6xl px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl font-bold leading-tight bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            {/* <span className="gradient-pink bg-clip-text text-transparent"> */}
              Sher Board
            {/* </span> */}
            <Sparkles className="inline ml-2 h-8 w-8 md:h-12 md:w-12 text-primary animate-float" />
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Made with love! and tears...a lot of tears...
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.to} to={feature.to}>
                <Card className="h-full shadow-card hover:shadow-pink transition-smooth hover:scale-[1.02] border-2">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-heading">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full">
                      Open →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Love Letter Section */}
        <div className="flex justify-center">
          <Card className="max-w-md w-full shadow-pink border-primary/20 border-2 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-heading flex items-center justify-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                A Letter For You
                <Mail className="h-6 w-6 text-primary" />
              </CardTitle>
              <CardDescription>
                Something special written by me
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button
                variant="pill"
                size="lg"
                onClick={() => setLetterOpen(true)}
                className="text-lg font-heading"
              >
                💌 Open Letter
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <LoveLetterModal open={letterOpen} onOpenChange={setLetterOpen} />
    </div>
  );
};

export default Dashboard;
