import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Dean of Engineering, Tech University",
    image: "",
    quote: "OutcomeMagic has completely transformed our accreditation preparation process. What used to take months now takes days, and the quality of our reports has improved dramatically."
  },
  {
    name: "Prof. Michael Chen",
    role: "Department Chair, Capitol College",
    image: "",
    quote: "The analytics provided by this platform have given us incredible insights into our curriculum. We've been able to make targeted improvements that have directly impacted student success."
  },
  {
    name: "Dr. Priya Patel",
    role: "Assessment Coordinator, Global Institute",
    image: "",
    quote: "I've worked with several assessment tools, but none compare to OutcomeMagic's ease of use and comprehensive features. It's been a game-changer for our institution."
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 relative">
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-accent-gradient text-2xl font-semibold mb-3">Client Testimonials</h2>
          <h3 className="text-4xl font-bold text-white mb-6">Trusted by Leading Institutions</h3>
          <p className="text-white/70 text-lg">
            Hear from educators and administrators who have transformed their assessment processes with OutcomeMagic.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-card border-white/10 animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-accent/30">
                      <AvatarFallback className="bg-accent/20 text-white">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                      {testimonial.image && <AvatarImage src={testimonial.image} alt={testimonial.name} />}
                    </Avatar>
                    <div>
                      <CardTitle className="text-white text-lg">{testimonial.name}</CardTitle>
                      <CardDescription className="text-white/60">{testimonial.role}</CardDescription>
                    </div>
                  </div>
                  <Quote className="h-6 w-6 text-accent/60" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 italic">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;