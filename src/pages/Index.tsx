import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, MapPin, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const features = [
  { icon: MapPin, title: "Find Spots", desc: "Real-time availability across multiple locations" },
  { icon: Clock, title: "Book Instantly", desc: "Reserve your slot in seconds, no waiting" },
  { icon: Shield, title: "Secure Parking", desc: "24/7 monitored and insured parking" },
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Car className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold">ParkSmart</span>
          </div>
          <Button
            onClick={() => navigate(user ? "/dashboard" : "/auth")}
            size="sm"
          >
            {user ? "Dashboard" : "Get Started"}
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              Smart Parking Available Now
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Park <span className="text-gradient">Smarter</span>,<br />
              Not Harder
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Find, book, and manage parking spots in real-time. No more circling the block — reserve your space before you arrive.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
                className="text-base px-8"
              >
                Book a Spot
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
                className="text-base px-8"
              >
                View Locations
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="glass-card rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 border-t border-border/50">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "50+", label: "Parking Spots" },
              { value: "24/7", label: "Availability" },
              { value: "99%", label: "Uptime" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-display font-bold text-primary">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
