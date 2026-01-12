'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Image 
              src="/assets/images/logo.svg" 
              alt="Boracity" 
              width={40}
              height={40}
              className="object-contain"
              priority
            /> 
            <span className="text-secondary text-[22px] font-bold tracking-tight">
              Boracity
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
            <li>
              <Link href="/" className="text-[15px] font-medium text-gray-700 hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/#explore" className="text-[15px] font-medium text-gray-700 hover:text-primary transition-colors">
                Explore
              </Link>
            </li>
            <li>
              <Link href="/#categories" className="text-[15px] font-medium text-gray-700 hover:text-primary transition-colors">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="text-[15px] font-medium text-gray-700 hover:text-primary transition-colors">
                Pricing
              </Link>
            </li>
          </ul>

          <div className="hidden lg:flex items-center gap-3.5">
            <Link href="/login" className="px-5 py-2 text-[14px] font-semibold text-secondary border-[1.5px] border-gray-200 rounded-md hover:border-primary hover:text-primary transition-all">
              Sign In
            </Link>
            <Link href="/login" className="px-6 py-2 text-[14px] font-semibold text-white bg-primary rounded-md hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 transition-all">
              Sign Up
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-6 py-4 space-y-4">
            <Link href="/" className="block text-[15px] font-medium text-gray-700 hover:text-primary">
              Home
            </Link>
            <Link href="/#explore" className="block text-[15px] font-medium text-gray-700 hover:text-primary">
              Explore
            </Link>
            <Link href="/#categories" className="block text-[15px] font-medium text-gray-700 hover:text-primary">
              Categories
            </Link>
            <Link href="/#pricing" className="block text-[15px] font-medium text-gray-700 hover:text-primary">
              Pricing
            </Link>
            <div className="pt-4 space-y-2">
              <Link href="/login" className="block w-full px-5 py-2 text-[14px] font-semibold text-secondary border-[1.5px] border-gray-200 rounded-md text-center">
                Sign In
              </Link>
              <Link href="/login" className="block w-full px-6 py-2 text-[14px] font-semibold text-white bg-primary rounded-md text-center">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}