
import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const eventsData = [
  {
    title: "Annual Charity Gala",
    date: "November 15, 2023",
    time: "6:00 PM - 10:00 PM",
    location: "Grand Ballroom, Celestial Hotel",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3269&q=80",
    description: "Join us for an elegant evening of fine dining, entertainment, and fundraising to support our global initiatives."
  },
  {
    title: "Community Volunteer Day",
    date: "October 8, 2023",
    time: "9:00 AM - 2:00 PM",
    location: "Riverside Park",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
    description: "Come together with neighbors to beautify our community parks and public spaces while building lasting connections."
  },
  {
    title: "Youth Leadership Workshop",
    date: "September 23, 2023",
    time: "10:00 AM - 3:00 PM",
    location: "Community Center, Harmony Hall",
    image: "https://images.unsplash.com/photo-1475721027785-f74ec9c7180a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
    description: "Empowering the next generation with skills in leadership, communication, and community service."
  }
];

const Events = () => {
  return (
    <section id="events" className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title animate-on-scroll">Upcoming Events</h2>
          <p className="section-subtitle animate-on-scroll">
            Join us at these upcoming events to connect, serve, and make a difference in our community.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {eventsData.map((event, index) => (
            <div 
              key={index} 
              className="glass-card overflow-hidden rounded-xl animate-on-scroll"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold mb-3">{event.title}</h3>
                
                <div className="flex items-center text-slate-600 mb-2">
                  <Calendar size={16} className="mr-2 text-blue-400" />
                  <span className="text-sm">{event.date}</span>
                </div>
                
                <div className="flex items-center text-slate-600 mb-2">
                  <Clock size={16} className="mr-2 text-blue-400" />
                  <span className="text-sm">{event.time}</span>
                </div>
                
                <div className="flex items-center text-slate-600 mb-4">
                  <MapPin size={16} className="mr-2 text-blue-400" />
                  <span className="text-sm">{event.location}</span>
                </div>
                
                <p className="text-slate-600 text-sm mb-6">{event.description}</p>
                
                <a 
                  href="#" 
                  className="inline-block w-full text-center py-2 border-2 border-blue-400 text-blue-500 hover:bg-blue-400 hover:text-white rounded-md transition-colors duration-300"
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 animate-on-scroll">
          <a href="#" className="text-blue-500 hover:text-blue-600 underline font-medium">View All Events</a>
        </div>
      </div>
    </section>
  );
};

export default Events;

