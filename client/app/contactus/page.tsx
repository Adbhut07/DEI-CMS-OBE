import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Github, Dribbble } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#111827] text-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-5xl font-bold mb-4">Contact Me</h1>
        <p className="text-xl mb-16 text-gray-300">
          Have questions or interested in working with me? Fill out the form below or use the direct contact information
          provided.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Send a Message</h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xl">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Your name"
                  className="bg-[#1e293b] border-[#334155] h-12 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xl">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                  className="bg-[#1e293b] border-[#334155] h-12 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xl">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="What would you like to discuss?"
                  className="bg-[#1e293b] border-[#334155] min-h-[160px] text-white placeholder:text-gray-400"
                />
              </div>

              <Button className="w-full h-12 text-lg bg-[#3b82f6] hover:bg-[#2563eb]">Send Message</Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-[#3b82f6] rounded-full p-4 mr-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Email</h3>
                  <a href="mailto:contact@example.com" className="text-[#3b82f6] hover:underline">
                    adbhut.rei.2233@gmail.com
                  </a>
                  <p className="text-gray-400">For general inquiries</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#3b82f6] rounded-full p-4 mr-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Phone</h3>
                  <a href="tel:+12345678990" className="text-[#3b82f6] hover:underline">
                    +91-9997808641
                  </a>
                  <p className="text-gray-400">Mon-Fri, 9am-5pm</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#3b82f6] rounded-full p-4 mr-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Location</h3>
                  <p className="text-[#3b82f6]">Dayalbagh Educational Institute</p>
                  <p className="text-gray-400">Agra - 282005 (UP), India</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#3b82f6] rounded-full p-4 mr-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Work Hours</h3>
                  <p className="text-[#3b82f6]">Monday - Friday</p>
                  <p className="text-gray-400">9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Connect with me</h2>
              <div className="flex space-x-4">
                <Link href="#" className="bg-[#1e293b] hover:bg-[#3b82f6] transition-colors p-3 rounded-full">
                  <Facebook className="h-6 w-6" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="bg-[#1e293b] hover:bg-[#3b82f6] transition-colors p-3 rounded-full">
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="bg-[#1e293b] hover:bg-[#3b82f6] transition-colors p-3 rounded-full">
                  <Instagram className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="bg-[#1e293b] hover:bg-[#3b82f6] transition-colors p-3 rounded-full">
                  <Github className="h-6 w-6" />
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link href="#" className="bg-[#1e293b] hover:bg-[#3b82f6] transition-colors p-3 rounded-full">
                  <Dribbble className="h-6 w-6" />
                  <span className="sr-only">Dribbble</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
