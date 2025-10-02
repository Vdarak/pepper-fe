import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-primary">
            Pepper
          </h1>
          <ThemeToggle />
        </header>

        <main className="max-w-2xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Hello World
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Welcome to Pepper - your scalable frontend application built with Next.js, TypeScript, and Tailwind CSS.
          </p>
          
          <div className="space-y-4">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors">
              Get Started
            </button>
            
            <div className="flex gap-4 justify-center">
              <div className="bg-card text-card-foreground p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Design System</h3>
                <p className="text-sm text-muted-foreground">OKLCH colors with custom variables</p>
              </div>
              
              <div className="bg-card text-card-foreground p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Typography</h3>
                <p className="text-sm text-muted-foreground">Geist fonts with fallbacks</p>
              </div>
              
              <div className="bg-card text-card-foreground p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Scalable</h3>
                <p className="text-sm text-muted-foreground">Ready for large projects</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
