import React, { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight, Heart, Shield, CheckCircle } from "lucide-react";

const InspirationData = [
  {
    quote: "Be educated, be organized, and be agitated.",
    author: "Dr. B.R. Ambedkar",
    avatar: "/img/Ambedkar.jpg",
  },
  {
    quote:
      "Go, get education. Be self-reliant, be industrious. Work – gather wisdom and riches.",
    author: "Savitribai Phule",
    avatar: "/img/savitribaiphule.png",
  },
  {
    quote:
      "The development of any society is impossible without the education of its women.",
    author: "Jyotiba Phule",
    avatar: "/img/jyotibaphule.jpg",
  },
  {
    quote:
      "Education is the key to progress and progress is the key to the success of any nation.",
    author: "Shahu Maharaj",
    avatar: "/img/shahu maharaj.webp",
  },
];

const InspirationGoalsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSubscribe = () => {
    window.open("https://rzp.io/rzp/mDdH2rh", "_blank");
  };

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === InspirationData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? InspirationData.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-tr from-indigo-100 to-blue-100 rounded-full blur-3xl opacity-30"></div>

      <div className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left Side - Inspiration */}
          <div className="animate-on-scroll flex flex-col">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <Quote className="text-white" size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-semibold text-slate-800">
                Our Inspirations
              </h2>
            </div>

            <div className="glass-card p-8 relative transition duration-700 ease-in-out flex-1 border border-blue-100/50 flex flex-col justify-center">


              <div className="pt-8">
               
                <div className="flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-lg opacity-30"></div>
                    <img
                      src={InspirationData[currentIndex].avatar}
                      alt={InspirationData[currentIndex].author}
                      className="relative w-[100px] h-[100px] rounded-full object-cover shadow-xl border-4 border-white"
                    />
                  </div>
                  <h4 className="font-semibold text-2xl text-slate-800 mt-4">
                    {InspirationData[currentIndex].author}
                  </h4>
                   <p className="text-lg md:text-xl font-serif text-slate-700 italic mb-8 leading-relaxed text-center">
                  "{InspirationData[currentIndex].quote}"
                </p>
                </div>

                <div className="flex justify-center mt-8 space-x-4">
                  <button
                    onClick={prevTestimonial}
                    className="w-12 h-12 rounded-xl border-2 border-blue-200 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-12 h-12 rounded-xl border-2 border-blue-200 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Dots indicator */}
                <div className="flex justify-center mt-6 gap-2">
                  {InspirationData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'w-6 bg-gradient-to-r from-blue-500 to-cyan-500' 
                          : 'bg-blue-200 hover:bg-blue-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Parivattan Sathi Subscription */}
          <div className="animate-on-scroll flex flex-col">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <Heart className="text-white" size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-semibold text-slate-800">
                Parivattan Sathi
              </h2>
            </div>

            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl shadow-xl p-8 flex-1 flex flex-col justify-between relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-400/30 mb-4">
                    <span className="text-xl">✨</span>
                    <span className="text-blue-300 text-xs font-semibold">135th Birth Anniversary</span>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                    ₹135 for the 135th Jayanti
                  </p>
                  <p className="text-blue-200 text-sm">
                    Dr. Babasaheb Ambedkar Jayanti | 14 April 2026
                  </p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
                    ₹135
                  </span>
                  <span className="text-lg text-blue-300 font-medium">/month</span>
                </div>

                <p className="text-blue-100 text-sm text-center mb-6">
                  Strengthen Babasaheb's Education Movement and help build an equal, educated future.
                </p>

                {/* Benefits */}
                <div className="space-y-3 mb-6">
                  {[
                    "Support Babasaheb's Education Movement",
                    "Monthly recurring contribution",
                    "Create an equal, educated future"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="text-cyan-400 flex-shrink-0" size={16} />
                      <span className="text-blue-100 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto relative z-10">
                <button 
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white font-bold py-4 rounded-xl hover:from-blue-600 hover:via-blue-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl"
                >
                  <Heart size={20} />
                  Subscribe Now
                </button>
                <p className="text-xs text-blue-300 text-center mt-4 flex items-center justify-center gap-2">
                  <Shield size={12} />
                  Secured by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InspirationGoalsSection;
