import React, { useEffect, useState } from "react";
import { Activity, Eye, Users, BarChart3, Clock, Globe2 } from "lucide-react";
import { useLiveVisitors } from "@/context/LiveVisitorsContext";
import { getVisitorStats, VisitorStats } from "@/lib/supabase-admin";

const Visitors = () => {
  const { count: liveVisitors } = useLiveVisitors();
  const [stats, setStats] = useState<VisitorStats>({
    today: 0,
    yesterday: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getVisitorStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load visitor stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="section-padding bg-gradient-to-b from-slate-50 to-white" id="visitors">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
            <Eye size={16} /> Visitor Overview
          </div>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif font-bold text-slate-900">
            Community At A Glance
          </h2>
          <p className="mt-3 text-slate-600 text-lg">
            See how many people are exploring our work right now and over time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard title="Live" value={liveVisitors} icon={<Activity className="text-emerald-600" />} color="from-emerald-50 to-emerald-100" />
          <StatCard title="Today" value={loading ? "..." : stats.today} icon={<Clock className="text-blue-600" />} color="from-blue-50 to-blue-100" />
          <StatCard title="Yesterday" value={loading ? "..." : stats.yesterday} icon={<Clock className="text-indigo-600" />} color="from-indigo-50 to-indigo-100" />
          <StatCard title="This Week" value={loading ? "..." : stats.thisWeek} icon={<BarChart3 className="text-purple-600" />} color="from-purple-50 to-purple-100" />
          <StatCard title="This Month" value={loading ? "..." : stats.thisMonth} icon={<Globe2 className="text-pink-600" />} color="from-pink-50 to-pink-100" />
          <StatCard title="Total" value={loading ? "..." : stats.total} icon={<Users className="text-cyan-600" />} color="from-cyan-50 to-cyan-100" />
        </div>
      </div>
    </section>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) => {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-5 border border-white shadow-sm flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-600">{title}</span>
        {icon}
      </div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>
    </div>
  );
};

export default Visitors;
