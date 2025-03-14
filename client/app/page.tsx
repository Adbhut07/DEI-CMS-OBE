import Benefits from "@/components/home/Benefits";
import CTA from "@/components/home/CTA";
import Demo from "@/components/home/Demo";
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import Navbar from "@/components/home/Navbar";
import Testimonials from "@/components/home/Testimonials";
import './index.css'

export default function Home() {
  return <>
  <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Benefits />
        <Demo />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  </>
    
}
