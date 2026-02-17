import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, Eye, Heart, Users, Calendar, MapPin, ArrowRight, View } from 'lucide-react';

const OurWork = () => {
  // Extract video ID from YouTube URL (including Shorts)
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  const youtubeVideoId = getYouTubeVideoId('https://youtu.be/SVsIU9ase4U?si=3zfC5CkuQD7xWcnO');
  const youtubeShortsVideoId = getYouTubeVideoId('https://www.youtube.com/shorts/7gXvxFzWZSA');

  const workItems = [
    {
      id: 3,
      type: 'video',
      title: 'Community Impact Stories',
      description: 'Quick glimpse of our community work and the positive changes we\'re creating together.',
      videoId: youtubeShortsVideoId,
      category: 'Community',
      date: '2024',
      location: 'Community Centers',
      impact: 'Inspiring Change',
      isShorts: true
    },
    {
      id: 5,
      type: 'image',
      title: 'Japanese Language Learning',
      description: 'Foreign language education program helping students access global opportunities.',
      image: '/img/japanese.jpeg',
      category: 'Language Education',
      date: '2024',
      location: 'Training Centers',
      impact: '100+ Students Enrolled'
    },
    {
      id: 6,
      type: 'image',
      title: 'Social Awareness Program',
      description: "A structured social awareness program committed to educating communities, amplifying important causes, and driving sustainable societal impact.",
      image: '/img/silder1.jpg',
      category: 'Volunteers',
      date: '2024',
      location: 'Community Centers',
      impact: '50+ Active Volunteers'
    }
  ];

  return (
    <section id='ourWork' className="section-padding bg-gradient-to-b from-blue-50/30 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-20 right-0 w-80 h-80 bg-gradient-to-tr from-indigo-100 to-blue-100 rounded-full blur-3xl opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="section-title animate-on-scroll">Our Work in Action</h2>
          <p className="section-subtitle animate-on-scroll mt-6">
            See how we're making a difference in communities through our various initiatives. 
            From healthcare to education, every project tells a story of hope and transformation.
          </p>
        </div>

        {/* Featured Video Section */}
        <div className="mb-16 animate-on-scroll">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl mx-auto border border-blue-100/50">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Featured Project</h3>
                  <p className="text-slate-500 text-sm">Community Health Initiative</p>
                </div>
                <Badge className="ml-auto bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 px-4">Latest</Badge>
              </div>
              
              <div className="aspect-video rounded-2xl overflow-hidden mb-6 shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`}
                  title="Community Health Initiative"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>2024</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Rural Communities</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>500+ Families Helped</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Work Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border border-blue-100/50 bg-white rounded-2xl">
              <div className="relative overflow-hidden">
                {item.type === 'video' && item.videoId ? (
                  <div className="aspect-video bg-slate-900">
                    <iframe
                      src={`https://www.youtube.com/embed/${item.videoId}?rel=0&modestbranding=1`}
                      title={item.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                    {item.category}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 line-clamp-3">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 font-medium">
                    <Heart className="w-4 h-4" />
                    <span>{item.impact}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl"
                    onClick={() => window.open("https://razorpay.me/@parivattanmissionfoundation", "_blank")}
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-on-scroll">
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl shadow-2xl p-10 md:p-12 max-w-3xl mx-auto text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4 text-white">Want to Make a Difference?</h3>
              <p className="text-blue-200 mb-8 text-lg max-w-xl mx-auto">
                Explore all our projects and initiatives that are making a real difference in communities.
              </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-8 py-6 text-lg rounded-full shadow-xl text-white"
                  onClick={() => window.location.href = "/#ourWork"}
                >
                  View All Projects
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-white/30 text-black hover:bg-white/10 px-8 py-6 text-lg rounded-full hover:text-white"
                  onClick={() => window.open("/donate", "_blank")}
                >
                  Join Our Mission
                </Button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurWork;
