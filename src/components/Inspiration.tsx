import React, { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

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
      "Education is the key to progress and progress is the key to the success of any nation.",
    author: "Shahu Maharaj",
    avatar: "/img/shahu maharaj.webp",
  },
];

const Inspiration = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <section id="Inspiration" className="section-padding bg-slate-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title animate-on-scroll">Our Inspirations</h2>
        </div>

        <div className="max-w-6xl mx-auto animate-on-scroll text-center">
          <div className="glass-card p-8 md:p-12 relative transition duration-700 ease-in-out">
            <div className="absolute -top-6 left-10 text-blue-400">
              <Quote size={48} />
            </div>

            <div className="pt-8">
              <p className="text-xl md:text-2xl font-serif text-slate-700 italic mb-8">
                "{InspirationData[currentIndex].quote}"
              </p>

              <div className="flex flex-col items-center justify-center">
                <img
                  src={InspirationData[currentIndex].avatar}
                  alt={InspirationData[currentIndex].author}
                  className="w-[120px] h-[120px] rounded-full object-cover shadow-md"
                />
                <div className="mt-4">
                  <h4 className="font-semibold text-3xl">
                    {InspirationData[currentIndex].author}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border-2 border-blue-400 flex items-center justify-center text-blue-500 hover:bg-blue-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border-2 border-blue-400 flex items-center justify-center text-blue-500 hover:bg-blue-400 hover:text-white transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Inspiration;

