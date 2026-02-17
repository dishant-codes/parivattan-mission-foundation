import React, { useState, useEffect } from 'react';
import { Heart, ArrowRight, Shield, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDonationStats, getVisitorStats, VisitorStats } from '@/lib/supabase-admin';
import { useLiveVisitors } from '@/context/LiveVisitorsContext';

const Donate = () => {
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [donorCount, setDonorCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({ today: 0, yesterday: 0, thisWeek: 0, thisMonth: 0, total: 0 });
  const [visitorsLoading, setVisitorsLoading] = useState(true);
  const { count: liveVisitors } = useLiveVisitors();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const stats = await getDonationStats();
        setTotalAmount(stats.total_amount);
        setDonorCount(stats.total_donations);
      } catch (error) {
        console.error('Error fetching donation stats:', error);
        setTotalAmount(0);
        setDonorCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setVisitorsLoading(true);
        const stats = await getVisitorStats();
        setVisitorStats(stats);
      } catch (error) {
        console.error('Error fetching visitor stats:', error);
        setVisitorStats({ today: 0, yesterday: 0, thisWeek: 0, thisMonth: 0, total: 0 });
      } finally {
        setVisitorsLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  const handleDonationClick = () => {
    navigate('/donate');
  };

  return (
    <section id="donate" className="section-padding bg-gradient-to-b from-blue-50/50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-200 to-indigo-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
            {/* Decorative elements inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>

            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              {/* Left Content */}
              <div className="animate-on-scroll">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/30 mb-6">
                  <Heart size={16} className="text-blue-400" />
                  <span className="text-blue-200 text-sm font-medium">Make an Impact Today</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white leading-tight">
                  Your Support <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Changes Lives</span>
                </h2>
                <p className="text-blue-100/90 text-lg mb-8 leading-relaxed">
                  Support our mission and help us create sustainable social impact in our community. Every contribution, big or small, makes a real difference.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center group">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mr-4 group-hover:bg-blue-500/30 transition-colors">
                      <Heart size={18} className="text-blue-400" />
                    </div>
                    <span className="text-blue-100">One-time & recurring donations</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mr-4 group-hover:bg-blue-500/30 transition-colors">
                      <Shield size={18} className="text-blue-400" />
                    </div>
                    <span className="text-blue-100">100% secure & tax deductible</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mr-4 group-hover:bg-blue-500/30 transition-colors">
                      <TrendingUp size={18} className="text-blue-400" />
                    </div>
                    <span className="text-blue-100">Transparent fund utilization</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    handleDonationClick();
                  }}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group"
                >
                  <Heart size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                  Donate Now
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Right Content - Stats */}
              <div className="animate-on-scroll">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-colors">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">₹25L</div>
                    <div className="text-blue-200 text-sm font-medium">Our Fundraising Goal</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-colors">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                      {loading ? '...' : `₹${totalAmount.toLocaleString("en-IN")}`}
                    </div>
                    <div className="text-blue-200 text-sm font-medium">Amount Raised</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-colors">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                      {loading ? '...' : donorCount}
                    </div>
                    <div className="text-blue-200 text-sm font-medium">Total Donations</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-colors">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                      {loading ? '...' : `₹${(2500000 - totalAmount).toLocaleString("en-IN")}`}
                    </div>
                    <div className="text-blue-200 text-sm font-medium">Amount Remaining</div>
                  </div>
                </div>

                {/* Minimum donation badge */}
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-sm font-medium">
                    <Heart size={14} />
                    Minimum donation: Just ₹1
                  </span>
                </div>

                {/* Trust badges */}
                <div className="mt-6 flex items-center justify-center gap-4 text-blue-300/70 text-xs">
                  <div className="flex items-center gap-1">
                    <Shield size={14} />
                    <span>SSL Secured</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donate;
