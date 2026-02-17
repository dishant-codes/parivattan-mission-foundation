import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

const WelcomeModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // Show modal after a short delay when component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full md:max-w-[30%] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200 shadow-lg"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Title */}
        {/* <div className="p-6 text-center border-b border-gray-200">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800">
            🎌 <span className="text-blue-600">JAPANESE LANGUAGE</span> Course Registration
          </h2>
        </div> */}

        {/* Full Poster Image */}
        <div className="relative">
          <img
            src="/img/learn_japanese.jpeg"
            alt="PARIVATTAN Mission Foundation - Learn Japanese Language"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Registration Button */}
        <div className="p-6">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSchq1jjNPM5vdfhnKpPRMhCLyj8M1PaubpLBqxIhTRMB2U3_g/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg"
          >
            <ExternalLink size={20} />
            Register Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;

