import React, { useState } from "react";

type Testimonial = {
  name: string;
  role: string;
  videoUrl: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Name",
    role: "role",
    videoUrl: "https://www.youtube.com/embed/j3vatdvUQx8",
  },
  {
    name: "Name2",
    role: "role",
    videoUrl: "https://www.youtube.com/embed/ZOnK3zoIQR0",
  },
  {
    name: "Name3",
    role: "role",
    videoUrl: "https://www.youtube.com/embed/cHq-A-s2vxw",
  },
];

const getYouTubeId = (url: string) => {
  const match = url.match(/embed\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

const Testimonials: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section id="testimonials" className="section-padding bg-slate-50">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">What Our Team Says</h2>
        <p className="text-lg text-gray-600 mb-12">
          Real stories from real developers.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const videoId = getYouTubeId(testimonial.videoUrl);
            const thumbnailUrl = videoId
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : "";

            return (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer"
                onClick={() => setActiveVideo(testimonial.videoUrl)}
              >
                <div className="relative">
                  <img
                    src={thumbnailUrl}
                    alt={`Thumbnail of ${testimonial.name}`}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white text-black text-2xl rounded-full p-2 shadow-lg">
                      ▶
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Video Modal */}
        {activeVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4 ">
            <div className="bg-white rounded-lg overflow-hidden max-w-3xl w-full relative shadow-lg  ">
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 right-3 text-black bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition"
              >
                ✕
              </button>
              <div className="aspect-w-16 h-[300px]">
                <iframe
                  className="w-full h-full"
                  src={activeVideo}
                  title="Testimonial Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;

