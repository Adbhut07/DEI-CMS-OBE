import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 glass-morphism mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-7 w-7 text-accent" />
              <span className="text-xl font-bold text-white">Cognitia</span>
            </div>
            <p className="text-white/60 mb-4">
              Transforming outcome-based education with powerful, intuitive software solutions.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Features</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Marks Management</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Outcome Mapping</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Analytics Dashboard</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Reporting Tools</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">User Management</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Case Studies</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Support Center</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Webinars</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-white/60">adbhut.rei.2233@gmail.com</li>
              <li className="text-white/60">+91 9997808641</li>
              <li className="text-white/60">Dayalbagh Educational Institue, Agra (UP), India</li>
              <li className="text-white/60">Agra - 282005 (UP), India</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 mb-4 md:mb-0">
            © {new Date().getFullYear()} Cognitia. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;