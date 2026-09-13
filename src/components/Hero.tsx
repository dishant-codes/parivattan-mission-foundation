import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
// import 'swiper/swiper.css';
import { useLiveVisitors } from '@/context/LiveVisitorsContext';

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const { count: liveVisitors } = useLiveVisitors();

  useEffect(() => {
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const button = buttonRef.current;

    if (title) title.classList.add('animate-fade-in');

    setTimeout(() => {
      if (subtitle) subtitle.classList.add('animate-fade-in');
    }, 300);

    setTimeout(() => {
      if (button) button.classList.add('animate-fade-in');
    }, 600);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[760px] flex items-center justify-center overflow-hidden bg-[#24312d]"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#24312d]/95 via-[#24312d]/60 to-[#24312d]/30 z-10"></div>

        {/* Background Image Slider */}
        <Swiper
          modules={[Autoplay]}
          loop={true}
          autoplay={{ 
            delay: 6000,
            disableOnInteraction: false
          }}
          speed={2000}
          className="absolute top-0 left-0 w-full h-full"
        >
          <SwiperSlide>
            <img
              src="/img/hero.jpg"
              alt="Heavenly Hands - Transforming Lives"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
          {/* <SwiperSlide>
            <img
              src="/img/silder1.jpg"
              alt="Community Support and Education"
              className="w-full h-full object-cover"
            />
          </SwiperSlide> */}
          <SwiperSlide>
            <img
              src="/img/silder2.jpg"
              alt="Healthcare and Wellness Programs"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/img/silder3.jpg"
              alt="Environmental Sustainability"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/img/silder4.jpg"
              alt="Educational Empowerment"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="container mx-auto px-5 z-10 text-left pt-20">
        <div className="flex flex-col items-center gap-3 mb-6">
          {/* <div className="inline-block px-4 py-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full">
            <span className="text-blue-200 font-medium text-sm uppercase tracking-wider">Empowering Communities Since 2020</span>
          </div> */}
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 animate-pulse"></span>
            {liveVisitors === 1 ? '1 person viewing now' : `${liveVisitors} people viewing now`}
          </div> */}
        </div>
        <div className="mb-7 max-w-3xl text-sm font-bold uppercase tracking-[0.2em] text-[#f2c5a8]">Education creates room to choose</div>
        <h1
          ref={titleRef}
          className="opacity-0 max-w-4xl text-5xl md:text-7xl lg:text-8xl font-serif font-normal mb-6 leading-[0.98] text-white"
        >
          Education should open <span className="text-[#f2c5a8]">more doors.</span>
        </h1>
        <p
          ref={subtitleRef}
          className="opacity-0 text-lg md:text-xl text-white/75 max-w-2xl mb-10 leading-relaxed"
        >
          Parivattan builds practical learning pathways with communities, so more people can move toward the future they imagine.
        </p>
        <div ref={buttonRef} className="opacity-0 flex flex-col sm:flex-row gap-4 items-start">
          <a 
            href="#donate" 
            className="px-8 py-4 bg-[#e5a37f] text-[#24312d] font-semibold rounded-full hover:bg-[#f2c5a8] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            Make a Donation
          </a>
          <a 
            href="#mission" 
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/35 hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
          >
            Learn More About Us
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Decorative element - modern wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
