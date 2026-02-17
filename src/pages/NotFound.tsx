import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
          <span className="text-4xl font-bold text-white">404</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-slate-800 mb-4">Page Not Found</h1>
        <p className="text-lg text-slate-600 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-200 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-all"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </button>
          <a 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
          >
            <Home size={18} className="mr-2" />
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
