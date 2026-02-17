import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart, ArrowRight, Globe, Linkedin, Youtube } from 'lucide-react';
import partnerLogo from '../assets/partner.jpg';
import qrCode from '../assets/qr.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="mb-8">
              <h3 className="text-3xl font-serif font-bold text-white mb-4">
                Parivattan Mission Foundation
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mb-6 rounded-full"></div>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Extending divine love through human hands. Join us in our mission to spread 
                compassion and hope to communities worldwide.
              </p>
            </div>
            
            {/* Social Media */}
            <div>
              <h5 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
                Follow Our Journey
              </h5>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, href: 'https://www.facebook.com/share/1GrmV9sNzE/' },
                  { icon: Instagram, href: 'https://www.instagram.com/parivattan_mission_foundation' },
                  { icon: Twitter, href: 'https://x.com/ParivattanMF' },
                  { icon: Youtube, href: 'https://youtube.com/@parivattanmissionfoundation?si=2DO8HxNu_AgDC5l9' },
                ].map((social, index) => (
                  <a 
                    key={index}
                    href={social.href} 
                    className="group w-11 h-11 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-blue-500 hover:border-blue-500 transition-all duration-300"
                  >
                    <social.icon size={18} className="text-slate-400 group-hover:text-white group-hover:scale-110 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h5 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-6">
              Navigation
            </h5>
            <nav className="space-y-3">
              {[
                { label: 'Home', href: '#hero' },
                { label: 'About Us', href: '#mission' },
                { label: 'Our Work', href: '#work' },
                { label: 'Events', href: '#events' },
                { label: 'Donate', href: '#donate' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="group flex items-center text-slate-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <ArrowRight 
                    size={14} 
                    className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-blue-400" 
                  />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {link.label}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3">
            <h5 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-6">
              Get In Touch
            </h5>
            <div className="space-y-5">
              <div className="flex items-start group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mr-4 group-hover:bg-blue-500/20 transition-colors">
                  <MapPin size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    Dharashiv (Osmanabad)<br />
                    Maharashtra, India 413501
                  </p>
                </div>
              </div>
              
              <div className="flex items-center group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mr-4 group-hover:bg-blue-500/20 transition-colors">
                  <Phone size={18} className="text-blue-400" />
                </div>
                <a 
                  href="tel:+917820831901" 
                  className="text-slate-300 hover:text-blue-400 transition-colors font-medium text-sm"
                >
                  +91 7820831901
                </a>
              </div>
              
              <div className="flex items-center group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mr-4 group-hover:bg-blue-500/20 transition-colors">
                  <Mail size={18} className="text-blue-400" />
                </div>
                <a 
                  href="mailto:info@parivattan.org" 
                  className="text-slate-300 hover:text-blue-400 transition-colors font-medium text-sm"
                >
                  contact@parivattan.org
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h5 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-6">
              Stay Connected
            </h5>
            <p className="text-slate-400 mb-6 leading-relaxed text-sm">
              Subscribe to receive updates about our latest initiatives and community impact.
            </p>
            <form className="space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full py-4 px-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 focus:border-blue-500 focus:bg-white/10 transition-all duration-300 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-blue-500/20"
              >
                Subscribe Now
              </button>
            </form>
            <p className="text-slate-500 text-xs mt-4 leading-relaxed">
              We respect your privacy and will never share your information.
            </p>
          </div>
        </div>
      </div>

      {/* Partners & QR Section */}
      <div className="border-t border-white/5 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Partners */}
            <div className="text-center lg:text-left">
              <h5 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">
                Our Trusted Partners
              </h5>
              <div className="flex justify-center lg:justify-start">
                <div className="group relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-500/30 transition-all duration-300"></div>
                  <img 
                    src={partnerLogo} 
                    alt="Partner Logo - AANA" 
                    className="relative h-24 w-auto object-contain rounded-2xl bg-white/95 backdrop-blur-sm p-4 shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
            
            {/* QR Code */}
            <div className="text-center">
              <h5 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">
                Pay Instantly
              </h5>
              <div className="flex flex-col items-center">
                <div className="group relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-500/30 transition-all duration-300"></div>
                  <img 
                    src={qrCode} 
                    alt="QR Code - Connect with Parivattan" 
                    className="relative h-52 w-52 object-contain rounded-2xl bg-white/95 backdrop-blur-sm p-4 shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <p className="text-slate-400 text-sm mt-4 font-medium">
                  Scan to pay instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-slate-950">
        <div className="container mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-slate-500">
              <Heart size={14} className="text-blue-500" />
              <span className="text-sm">
                &copy; {currentYear} Parivattan Foundation. Made with love for a better tomorrow.
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
