import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#212121] text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-gray-800">
          {/* About Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-6">
              <Image 
  src="/assets/images/logo.svg" 
  alt="Boracity" 
  width={40}
  height={40}
  className="object-contain"
  style={{ filter: 'brightness(0) invert(1)' }}
/>

              <span className="text-white text-[22px] font-bold tracking-tight">
                Boracity
              </span>
            </div>
            <p className="text-gray-400 text-[15px] leading-relaxed">
              Your trusted source for professional BIM families. Enhance your Revit projects with our high-quality library.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-[15px] font-bold uppercase tracking-wide mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3.5">
              <li>
                <Link href="/#categories" className="text-gray-400 text-[15px] hover:text-white hover:translate-x-1 transition-all inline-block">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-gray-400 text-[15px] hover:text-white hover:translate-x-1 transition-all inline-block">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#support" className="text-gray-400 text-[15px] hover:text-white hover:translate-x-1 transition-all inline-block">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#blog" className="text-gray-400 text-[15px] hover:text-white hover:translate-x-1 transition-all inline-block">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-[15px] font-bold uppercase tracking-wide mb-6">
              Legal
            </h4>
            <ul className="space-y-3.5">
              <li>
                <Link href="#terms" className="text-gray-400 text-[15px] hover:text-white hover:translate-x-1 transition-all inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="text-gray-400 text-[15px] hover:text-white hover:translate-x-1 transition-all inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#cookies" className="text-gray-400 text-[15px] hover:text-white hover:translate-x-1 transition-all inline-block">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white text-[15px] font-bold uppercase tracking-wide mb-6">
              Stay Updated
            </h4>
            <p className="text-gray-400 text-[15px] leading-relaxed mb-5">
              Subscribe to our newsletter for new families and updates
            </p>
            <div className="flex gap-2.5 mb-6">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-md text-white text-[14px] placeholder:text-gray-600 focus:outline-none focus:border-primary focus:bg-[#333] transition-all"
              />
              <button className="px-7 py-3 bg-primary text-white text-[14px] font-semibold rounded-md hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 transition-all whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-[#2a2a2a] rounded-md text-gray-400 hover:bg-primary hover:text-white hover:-translate-y-1 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-[#2a2a2a] rounded-md text-gray-400 hover:bg-primary hover:text-white hover:-translate-y-1 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-[#2a2a2a] rounded-md text-gray-400 hover:bg-primary hover:text-white hover:-translate-y-1 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-[#2a2a2a] rounded-md text-gray-400 hover:bg-primary hover:text-white hover:-translate-y-1 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 text-center">
          <p className="text-gray-500 text-[14px]">
            © 2024 Boracity. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}