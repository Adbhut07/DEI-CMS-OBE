import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const Benefits = () => {
  const benefits = [
    "Simplify accreditation processes with automated reporting",
    "Improve curriculum based on concrete outcome data",
    "Save hundreds of hours on manual assessment tasks",
    "Increase transparency in student evaluation",
    "Identify and address learning gaps efficiently",
    "Support data-driven decision making across departments"
  ];

  return (
    <section id="benefits" className="py-20 relative">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="glass-card p-8 rounded-xl w-full max-w-xl h-80 flex items-center justify-center animate-fade-in">
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-500/20 z-10"></div>
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="bg-black/50 p-6 rounded-lg text-center max-w-sm backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-white mb-2">Proven Results</h3>
                  <p className="text-white/80">
                    Institutions using our software have reported a 40% increase in outcome attainment and 65% reduction in assessment workload.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-xl animate-fade-in animate-delay-200">
            <h2 className="text-accent-gradient text-2xl font-semibold mb-3">Why Choose OutcomeMagic</h2>
            <h3 className="text-4xl font-bold text-white mb-6">Transform Your Institution's Assessment Process</h3>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent mt-0.5" />
                  <p className="text-white/80 text-lg">{benefit}</p>
                </div>
              ))}
            </div>
            
            <Button className="bg-accent hover:bg-accent/80 text-white px-6 py-5 text-lg">
              Learn More <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;