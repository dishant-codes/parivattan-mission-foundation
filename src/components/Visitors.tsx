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
    <section className="bg-transparent px-4 py-10 text-white md:py-12" id="visitors">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-2 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#f2c5a8]">
              <Eye size={14} /> Visitor Overview
            </div>
            <h2 className="mt-2 text-2xl font-serif font-normal text-white md:text-3xl">
              Community At A Glance
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/55">
            A quick look at the people connecting with our work.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <StatCard title="Live" value={liveVisitors} icon={<Activity />} />
          <StatCard title="Today" value={loading ? "..." : stats.today} icon={<Clock />} />
          <StatCard title="Yesterday" value={loading ? "..." : stats.yesterday} icon={<Clock />} />
          <StatCard title="This Week" value={loading ? "..." : stats.thisWeek} icon={<BarChart3 />} />
          <StatCard title="This Month" value={loading ? "..." : stats.thisMonth} icon={<Globe2 />} />
          <StatCard title="Total" value={loading ? "..." : stats.total} icon={<Users />} />
        </div>
      </div>
    </section>
  );
};

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex min-h-[76px] flex-col justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/55">{title}</span>
        <span className="text-[#e5a37f]">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-[#f2c5a8]">{value}</div>
    </div>
  );
};

export default Visitors;
