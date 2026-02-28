"use client";


import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">SkillBridge</Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Connecting passionate tutors with eager learners to bridge the gap in skills and knowledge worldwide.
            </p>
            <div className="flex space-x-5 pt-4">
              <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Explore</h3>
            <ul className="space-y-4">
              <li><Link href="/tutors" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">Browse Tutors</Link></li>
              <li><Link href="/categories" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">Categories</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">How it works</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">Safety Center</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm leading-relaxed">
                  Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-blue-600 flex-shrink-0" />
                <span className="text-gray-600 text-sm leading-relaxed">+1 (555) 000-0000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-blue-600 flex-shrink-0" />
                <span className="text-gray-600 text-sm leading-relaxed">support@skillbridge.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} SkillBridge. All rights reserved.
          </p>
          <div className="flex space-x-8">
            <Link href="#" className="text-gray-400 hover:text-blue-600 text-xs transition-colors">Privacy</Link>
            <Link href="#" className="text-gray-400 hover:text-blue-600 text-xs transition-colors">Terms</Link>
            <Link href="#" className="text-gray-400 hover:text-blue-600 text-xs transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
