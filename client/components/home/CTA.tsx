import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/10 -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="glass-card p-8 md:p-12 rounded-2xl max-w-5xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Revolutionize Your Institution's Assessment Process?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-3xl mx-auto">
            Join hundreds of universities and colleges that have transformed their outcome-based education system with OutcomeMagic. Get started today and see the difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-accent hover:bg-accent/80 text-white px-8 py-6 text-lg">
              Request a Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white px-8 py-6 text-lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;