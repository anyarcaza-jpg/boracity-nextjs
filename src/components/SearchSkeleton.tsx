export default function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse"
        >
          <div className="w-full aspect-[4/3] bg-gray-200" />
          
          <div className="p-6">
            <div className="h-6 w-24 bg-gray-200 rounded-full mb-3" />
            <div className="h-6 bg-gray-200 rounded mb-2" />
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
            
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}