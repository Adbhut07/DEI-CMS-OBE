import { 
    LineChart, Book, Award, Database, BarChart, Shield, Users, Layers, RefreshCw
  } from "lucide-react";
  
  const features = [
    {
      icon: <LineChart className="h-8 w-8 text-accent" />,
      title: "Comprehensive Analytics",
      description: "Track student performance with detailed analytics and visualizations."
    },
    {
      icon: <Book className="h-8 w-8 text-accent" />,
      title: "Course Outcome Mapping",
      description: "Easily map course outcomes to program outcomes with our intuitive interface."
    },
    {
      icon: <Award className="h-8 w-8 text-accent" />,
      title: "Attainment Calculation",
      description: "Automatically calculate course and program outcome attainment levels."
    },
    {
      icon: <Database className="h-8 w-8 text-accent" />,
      title: "Centralized Data Management",
      description: "Store all assessment data in one secure, centralized location."
    },
    {
      icon: <BarChart className="h-8 w-8 text-accent" />,
      title: "Performance Reports",
      description: "Generate comprehensive reports for accreditation and improvement."
    },
    {
      icon: <Shield className="h-8 w-8 text-accent" />,
      title: "Data Security",
      description: "Enterprise-grade security to protect sensitive student information."
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: "Role-Based Access",
      description: "Control who can view and edit data with customizable user roles."
    },
    {
      icon: <Layers className="h-8 w-8 text-accent" />,
      title: "Multi-Level Assessment",
      description: "Support for direct and indirect assessment methods across programs."
    },
    {
      icon: <RefreshCw className="h-8 w-8 text-accent" />,
      title: "Continuous Improvement",
      description: "Tools to implement and track curriculum improvements based on outcome data."
    }
  ];
  
  const Features = () => {
    return (
      <section id="features" className="py-20 relative">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-accent-gradient text-2xl font-semibold mb-3">Powerful Features</h2>
            <h3 className="text-4xl font-bold text-white mb-6">Everything You Need for Outcome-Based Education</h3>
            <p className="text-white/70 text-lg">
              Our comprehensive software provides all the tools you need to implement, track, and improve outcome-based education at your institution.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="glass-card p-6 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Features;