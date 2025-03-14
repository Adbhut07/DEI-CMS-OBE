import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen pt-28 pb-20 relative">
      {/* Background gradient effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl space-y-6 text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gradient">
              Revolutionize Education with Outcome-Based Assessment
            </h1>
            <p className="text-lg md:text-xl text-white/70">
              Streamline your institution's outcome-based education system with our comprehensive software solution. Track, measure, and improve student outcomes with precision and ease.
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span className="text-white/80">Easy Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span className="text-white/80">Comprehensive Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span className="text-white/80">Secure Data</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Button className="bg-accent hover:bg-accent/80 text-white px-8 py-6 text-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white px-8 py-6 text-lg">
                Schedule Demo
              </Button>
            </div>
          </div>
          
          <div className="glass-card p-4 animate-fade-in animate-delay-400 w-full max-w-2xl">
            <img 
              src="/sst.png" 
              alt="Student Marks Management Software" 
              className="rounded-lg w-full object-cover shadow-lg" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;