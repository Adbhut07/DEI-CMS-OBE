'use client'

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, GraduationCap } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-morphism py-3' : 'py-5'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-accent" />
          <span className="text-xl font-bold text-white">OutcomeMagic</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
          <a href="#benefits" className="text-white/80 hover:text-white transition-colors">Benefits</a>
          <a href="#demo" className="text-white/80 hover:text-white transition-colors">Demo</a>
          <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">Testimonials</a>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white">Login</Button>
          <Button className="bg-accent hover:bg-accent/80 text-white">Get Started</Button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-morphism absolute top-full left-0 w-full py-4 px-6 flex flex-col gap-4">
          <a href="#features" className="text-white/80 hover:text-white py-2 transition-colors">Features</a>
          <a href="#benefits" className="text-white/80 hover:text-white py-2 transition-colors">Benefits</a>
          <a href="#demo" className="text-white/80 hover:text-white py-2 transition-colors">Demo</a>
          <a href="#testimonials" className="text-white/80 hover:text-white py-2 transition-colors">Testimonials</a>
          <div className="flex flex-col gap-3 pt-2">
            <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white">Login</Button>
            <Button className="w-full bg-accent hover:bg-accent/80 text-white">Get Started</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;