import React, { useState, useEffect } from "react";
import img1 from "/img/vol/vol2.jpg";
import img2 from "/img/vol/vol1.jpg";
import img3 from "/img/vol/vol3.jpg";

const images = [img1, img2, img3];

interface VolunteerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interests: string[];
  availability: string[];
  experience: string;
}

const defaultFormData: VolunteerFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  interests: [],
  availability: [],
  experience: ""
};

const Volunteer = () => {
  const [current, setCurrent] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<VolunteerFormData>(defaultFormData);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    setShowModal(false);
    setFormData(defaultFormData);
  };

  return (
    <section id="volunteer" className="section-padding bg-slate-50">
      <div className="container mx-auto px-4">
        {/* ... existing content ... */}
        <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 md:p-12 rounded-2xl shadow-md max-w-5xl mx-auto">
          {/* Image Slider */}
          <div className="w-full md:w-1/2 relative">
            <img
              src={images[current]}
              alt={`Volunteer ${current + 1}`}
              className="rounded-xl shadow-lg object-cover w-full h-[300px] transition-all duration-700"
            />
            <div className="absolute bottom-3 right-3 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === current ? "bg-blue-400" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrent(index)}
                ></button>
              ))}
            </div>
          </div>

          {/* Text + CTA */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4 text-blue-400">
              Why Volunteer?
            </h3>
            <p className="text-slate-700 mb-6">
              Volunteering with us means building stronger communities,
              supporting impactful causes, and gaining valuable experiences —
              all while meeting amazing people.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="inline-block px-6 py-3 bg-blue-400 text-white font-semibold rounded-full shadow-md hover:bg-blue-500 transition-colors"
            >
              Fill Volunteer Form
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg py-8 max-w-md w-full max-h-[95vh] overflow-y-auto ">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 p-2 bg-zinc-800 rounded-full"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6 text-gray-100"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSevS0mZuwhtncr_yGfZnas-8GXSNyqRbVClSSDgmhT-NpFdmQ/viewform?embedded=true"
              width="100%"
              height="1012"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
             
            >
              Loading…
            </iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default Volunteer;

