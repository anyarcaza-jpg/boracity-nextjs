import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6">
      <div className="text-center max-w-2xl">
        {/* 404 Number */}
        <div className="text-[150px] font-bold text-primary leading-none mb-6">
          404
        </div>
        
        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Family Not Found
        </h1>
        
        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Sorry, we couldn't find the BIM family you're looking for. 
          It may have been removed or the URL might be incorrect.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all shadow-sm hover:shadow-md"
          >
            <i className="fas fa-home mr-2"></i>
            Go to Homepage
          </Link>
          
          <Link
            href="/#explore"
            className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all"
          >
            <i className="fas fa-search mr-2"></i>
            Browse Families
          </Link>
        </div>
        
        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Popular categories:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link 
              href="/category/furniture" 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary hover:text-white transition-all"
            >
              Furniture
            </Link>
            <Link 
              href="/category/doors" 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary hover:text-white transition-all"
            >
              Doors
            </Link>
            <Link 
              href="/category/windows" 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary hover:text-white transition-all"
            >
              Windows
            </Link>
            <Link 
              href="/category/lighting" 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary hover:text-white transition-all"
            >
              Lighting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}