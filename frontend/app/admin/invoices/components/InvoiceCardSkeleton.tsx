const InvoiceCardSkeleton = () => {
    return (
      <div className="bg-white rounded-xl shadow-md p-5 animate-pulse">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-6 w-32 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded-md"></div>
          </div>
          <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 w-12 bg-gray-200 rounded-md"></div>
            <div className="h-6 w-28 bg-gray-200 rounded-md"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 w-10 bg-gray-200 rounded-md"></div>
            <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  };
  
  export default InvoiceCardSkeleton;