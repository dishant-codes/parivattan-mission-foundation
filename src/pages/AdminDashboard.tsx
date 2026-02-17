import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  X,
  Heart,
  Plus,
  PieChart,
  Download,
  BarChart3,
  MessageSquare,
  Mail,
  Eye,
  Reply,
} from "lucide-react";
import {
  getAllDonations,
  getDonationsByStatus,
  searchDonations,
  updateDonationStatus,
  deleteDonation,
  getDonationStats,
  clearAdminAuth,
  getAdminAuth,
  Donation,
  createDonation,
  getAllContacts,
  updateContactStatus,
  deleteContact,
  Contact,
  getVisitorStats,
  VisitorStats,
} from "@/lib/supabase-admin";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLiveVisitors } from "@/context/LiveVisitorsContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [stats, setStats] = useState({
    total_donations: 0,
    total_amount: 0,
    completed: 0,
    pending: 0,
    failed: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<"pending" | "completed" | "failed">(
    "pending"
  );
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Donation>>({});
  const [error, setError] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDonationData, setNewDonationData] = useState({
    donor_name: "",
    donor_email: "",
    donor_phone: "",
    amount: 0,
    currency: "INR",
    payment_id: "",
    order_id: "",
    service_name: "",
    status: "completed" as const,
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPieChart, setShowPieChart] = useState(false);
  const [activeTab, setActiveTab] = useState<"donations" | "contacts">("donations");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    today: 0,
    yesterday: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
  });

  const FUNDRAISING_GOAL = 2500000; // 25 Lakhs
  const { count: liveVisitors } = useLiveVisitors();

  // Export to Excel/CSV function
  const exportToExcel = () => {
    const headers = ['Donor Name', 'Email', 'Phone', 'Amount', 'Currency', 'Payment ID', 'Order ID', 'Status', 'Service', 'Date'];
    const csvData = filteredDonations.map(d => [
      d.donor_name,
      d.donor_email,
      d.donor_phone || '',
      d.amount,
      d.currency,
      d.payment_id,
      d.order_id || '',
      d.status,
      d.service_name || '',
      new Date(d.created_at).toLocaleDateString('en-IN')
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `donations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pie Chart Component
  const PieChartComponent = () => {
    const total = stats.completed + stats.pending + stats.failed;
    const progress = Math.min((stats.total_amount / FUNDRAISING_GOAL) * 100, 100);
    const remaining = FUNDRAISING_GOAL - stats.total_amount;
    const remainingPercent = 100 - progress;
    
    // Calculate stroke-dasharray for fundraising pie chart
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    
    const raisedDash = (progress / 100) * circumference;
    const remainingDash = (remainingPercent / 100) * circumference;
    
    // Status percentages
    const completedPercent = total > 0 ? (stats.completed / total) * 100 : 0;
    const pendingPercent = total > 0 ? (stats.pending / total) * 100 : 0;
    const failedPercent = total > 0 ? (stats.failed / total) * 100 : 0;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="text-blue-600" size={28} />
              Fundraising Analytics
            </h2>
            <button
              onClick={() => setShowPieChart(false)}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <X size={24} className="text-slate-500" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left - Target vs Raised Pie Chart */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Target vs Amount Raised</h3>
              
              {/* SVG Pie Chart for Target vs Raised */}
              <svg width="200" height="200" viewBox="0 0 220 220" className="mb-4">
                {/* Background circle (remaining) */}
                <circle cx="110" cy="110" r={radius} fill="transparent" stroke="#e5e7eb" strokeWidth="35" />
                
                {/* Raised segment */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="transparent"
                  stroke="url(#raisedGradient)"
                  strokeWidth="35"
                  strokeDasharray={`${raisedDash} ${circumference}`}
                  transform="rotate(-90 110 110)"
                  strokeLinecap="round"
                />
                
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="raisedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                
                {/* Center circle */}
                <circle cx="110" cy="110" r="55" fill="white" />
                <text x="110" y="100" textAnchor="middle" className="text-xl font-bold" fill="#1e40af">{progress.toFixed(4)}%</text>
                <text x="110" y="125" textAnchor="middle" className="text-xs" fill="#64748b">of Target</text>
              </svg>
              
              {/* Target vs Raised Legend */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 text-center border border-blue-200">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-lg font-bold text-blue-700">₹{stats.total_amount.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-blue-600">Amount Raised</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mx-auto mb-1"></div>
                  <div className="text-lg font-bold text-gray-700">₹{remaining.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-gray-600">Remaining</div>
                </div>
              </div>
              
              
            </div>
            
            {/* Right - Status Breakdown */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Donation Status Breakdown</h3>
              
              {/* Status Pie Chart */}
              <svg width="200" height="200" viewBox="0 0 220 220" className="mb-4">
                <circle cx="110" cy="110" r={radius} fill="#f3f4f6" />
                
                {/* Completed segment */}
                {stats.completed > 0 && (
                  <circle
                    cx="110"
                    cy="110"
                    r={radius}
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="35"
                    strokeDasharray={`${(completedPercent / 100) * circumference} ${circumference}`}
                    transform="rotate(-90 110 110)"
                  />
                )}
                
                {/* Pending segment */}
                {stats.pending > 0 && (
                  <circle
                    cx="110"
                    cy="110"
                    r={radius}
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="35"
                    strokeDasharray={`${(pendingPercent / 100) * circumference} ${circumference}`}
                    transform={`rotate(${-90 + (completedPercent * 3.6)} 110 110)`}
                  />
                )}
                
                {/* Failed segment */}
                {stats.failed > 0 && (
                  <circle
                    cx="110"
                    cy="110"
                    r={radius}
                    fill="transparent"
                    stroke="#ef4444"
                    strokeWidth="35"
                    strokeDasharray={`${(failedPercent / 100) * circumference} ${circumference}`}
                    transform={`rotate(${-90 + ((completedPercent + pendingPercent) * 3.6)} 110 110)`}
                  />
                )}
                
                {/* Center circle */}
                <circle cx="110" cy="110" r="55" fill="white" />
                <text x="110" y="100" textAnchor="middle" className="text-2xl font-bold" fill="#1e293b">{total}</text>
                <text x="110" y="125" textAnchor="middle" className="text-xs" fill="#64748b">Total Donations</text>
              </svg>
              
              {/* Status Legend */}
              <div className="grid grid-cols-3 gap-2 w-full">
                <div className="bg-emerald-50 rounded-xl p-2 text-center border border-emerald-200">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-lg font-bold text-emerald-700">{stats.completed}</div>
                  <div className="text-xs text-emerald-600">Completed</div>
                  <div className="text-xs text-emerald-500">{completedPercent.toFixed(1)}%</div>
                </div>
                <div className="bg-yellow-50 rounded-xl p-2 text-center border border-yellow-200">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-lg font-bold text-yellow-700">{stats.pending}</div>
                  <div className="text-xs text-yellow-600">Pending</div>
                  <div className="text-xs text-yellow-500">{pendingPercent.toFixed(1)}%</div>
                </div>
                <div className="bg-red-50 rounded-xl p-2 text-center border border-red-200">
                  <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-lg font-bold text-red-700">{stats.failed}</div>
                  <div className="text-xs text-red-600">Failed</div>
                  <div className="text-xs text-red-500">{failedPercent.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Stats - Matching Main Website */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
              <div className="text-xs text-blue-600 font-medium">Amount Raised</div>
              <div className="text-lg font-bold text-blue-800">₹{stats.total_amount.toLocaleString('en-IN')}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200">
              <div className="text-xs text-purple-600 font-medium">Target Goal</div>
              <div className="text-lg font-bold text-purple-800">₹25,00,000</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border border-orange-200">
              <div className="text-xs text-orange-600 font-medium">Progress</div>
              <div className="text-lg font-bold text-orange-800">{progress.toFixed(4)}%</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 text-center border border-emerald-200">
              <div className="text-xs text-emerald-600 font-medium">Remaining</div>
              <div className="text-lg font-bold text-emerald-800">₹{remaining.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Check authentication on mount and continuously
  useEffect(() => {
    // Initial check
    if (!getAdminAuth()) {
      navigate("/", { replace: true });
      return;
    }

    // Check auth on visibility change (when user switches tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !getAdminAuth()) {
        navigate("/", { replace: true });
      }
    };

    // Check auth on popstate (browser back/forward buttons)
    const handlePopState = () => {
      if (!getAdminAuth()) {
        navigate("/", { replace: true });
      }
    };

    // Check auth periodically (every 30 seconds)
    const authCheckInterval = setInterval(() => {
      if (!getAdminAuth()) {
        navigate("/", { replace: true });
      }
    }, 30000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
      clearInterval(authCheckInterval);
    };
  }, [navigate]);

  // Load donations and stats
  useEffect(() => {
    loadData();
    loadVisitorData();
  }, []);

  // Load contacts when tab changes
  useEffect(() => {
    if (activeTab === "contacts") {
      loadContacts();
    }
  }, [activeTab]);

  // Apply filters and search
  useEffect(() => {
    applyFiltersAndSearch();
  }, [donations, searchQuery, filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [donationsData, statsData] = await Promise.all([
        getAllDonations(),
        getDonationStats(),
      ]);

      setDonations(donationsData);
      setStats(statsData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load donations. Please check your Supabase configuration.");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = async () => {
    let result = [...donations];

    // Apply filter
    if (filterStatus !== "all") {
      result = result.filter((d) => d.status === filterStatus);
    }

    // Apply search
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.donor_name.toLowerCase().includes(searchLower) ||
          d.donor_email.toLowerCase().includes(searchLower) ||
          d.payment_id.toLowerCase().includes(searchLower)
      );
    }

    setFilteredDonations(result);
  };

  const loadVisitorData = async () => {
    try {
      const stats = await getVisitorStats();
      setVisitorStats(stats);
    } catch (err) {
      console.error("Error loading visitor stats:", err);
    }
  };

  const loadContacts = async () => {
    try {
      setContactsLoading(true);
      const contactsData = await getAllContacts();
      setContacts(contactsData);
    } catch (err) {
      console.error("Error loading contacts:", err);
    } finally {
      setContactsLoading(false);
    }
  };

  const handleContactStatusUpdate = async (id: string, status: "new" | "read" | "replied") => {
    try {
      await updateContactStatus(id, status);
      setContacts(contacts.map(c => c.id === id ? { ...c, status } : c));
    } catch (err) {
      console.error("Error updating contact status:", err);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }
    try {
      await deleteContact(id);
      setContacts(contacts.filter(c => c.id !== id));
      setSelectedContact(null);
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  const getContactStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "read":
        return "bg-yellow-100 text-yellow-800";
      case "replied":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: "pending" | "completed" | "failed") => {
    try {
      await updateDonationStatus(id, newStatus);
      setDonations(
        donations.map((d) =>
          d.id === id ? { ...d, status: newStatus } : d
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleEditDonation = (donation: Donation) => {
    setEditingDonation(donation);
    setEditFormData({ ...donation });
  };

  const handleUpdateDonation = async () => {
    if (!editingDonation) return;

    try {
      // Update the donation with new data
      await updateDonationStatus(editingDonation.id, editFormData.status as any);
      
      // Update local state with all changes
      setDonations(
        donations.map((d) =>
          d.id === editingDonation.id
            ? { ...d, ...editFormData }
            : d
        )
      );

      setEditingDonation(null);
      setEditFormData({});
    } catch (err) {
      console.error("Error updating donation:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) {
      return;
    }

    try {
      setDeleting(id);
      await deleteDonation(id);
      setDonations(donations.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Error deleting donation:", err);
    } finally {
      setDeleting(null);
    }
  };

  const handleAddDonation = async () => {
    // Validation
    if (
      !newDonationData.donor_name ||
      !newDonationData.donor_email ||
      newDonationData.amount <= 0 ||
      !newDonationData.payment_id
    ) {
      alert("Please fill in all required fields (name, email, amount, payment ID)");
      return;
    }

    try {
      setSubmitting(true);
      const donation = await createDonation({
        donor_name: newDonationData.donor_name,
        donor_email: newDonationData.donor_email,
        donor_phone: newDonationData.donor_phone,
        amount: newDonationData.amount,
        currency: newDonationData.currency,
        payment_id: newDonationData.payment_id,
        order_id: newDonationData.order_id,
        service_name: newDonationData.service_name || undefined,
        status: newDonationData.status,
      });

      // Add to local state
      setDonations([donation, ...donations]);
      
      // Reset form
      setNewDonationData({
        donor_name: "",
        donor_email: "",
        donor_phone: "",
        amount: 0,
        currency: "INR",
        payment_id: "",
        order_id: "",
        service_name: "",
        status: "completed",
      });
      setShowAddForm(false);

      // Reload stats
      const statsData = await getDonationStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error adding donation:", err);
      alert("Failed to add donation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    // Clear all auth data
    clearAdminAuth();
    
    // Clear any browser cache for this page
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    
    // Use replace to prevent back button access
    navigate("/", { replace: true });
    
    // Force reload to clear any in-memory state
    window.location.reload();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={20} className="text-green-500" />;
      case "pending":
        return <Clock size={20} className="text-yellow-500" />;
      case "failed":
        return <XCircle size={20} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Check auth before rendering - redirect immediately if not authenticated
  if (!getAdminAuth()) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-slate-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">


      <div className="section-padding pt-20 md:pt-20">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-serif font-bold text-slate-800">
                Admin Dashboard
              </h1>
              <p className="text-slate-500 mt-2">Manage donations, contacts and track fundraising</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowPieChart(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors"
              >
                <PieChart size={20} className="mr-2" />
                View Chart
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-colors"
              >
                <Download size={20} className="mr-2" />
                Export Excel
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Add Donation
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-blue-200">
            <button
              onClick={() => setActiveTab("donations")}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors border-b-2 -mb-[2px] ${
                activeTab === "donations"
                  ? "text-blue-600 border-blue-600"
                  : "text-slate-500 border-transparent hover:text-blue-500"
              }`}
            >
              <Heart size={20} />
              Donations
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors border-b-2 -mb-[2px] ${
                activeTab === "contacts"
                  ? "text-blue-600 border-blue-600"
                  : "text-slate-500 border-transparent hover:text-blue-500"
              }`}
            >
              <MessageSquare size={20} />
              Contacts
              {contacts.filter(c => c.status === "new").length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {contacts.filter(c => c.status === "new").length}
                </span>
              )}
            </button>
          </div>

          {activeTab === "donations" && (
          <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="text-sm text-blue-600 font-semibold">Total Donations</div>
              <div className="text-3xl font-bold text-blue-900 mt-2">
                {stats.total_donations}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="text-sm text-green-600 font-semibold">Amount Raised</div>
              <div className="text-2xl font-bold text-green-900 mt-2">
                ₹{stats.total_amount.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="text-sm text-purple-600 font-semibold">Target Goal</div>
              <div className="text-2xl font-bold text-purple-900 mt-2">
                ₹25,00,000
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div className="text-sm text-orange-600 font-semibold">Progress</div>
              <div className="text-2xl font-bold text-orange-900 mt-2">
                {((stats.total_amount / FUNDRAISING_GOAL) * 100).toFixed(4)}%
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
              <div className="text-sm text-emerald-600 font-semibold">Remaining</div>
              <div className="text-2xl font-bold text-emerald-900 mt-2">
                ₹{(FUNDRAISING_GOAL - stats.total_amount).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 border border-cyan-200">
              <div className="text-sm text-cyan-600 font-semibold">Live Visitors</div>
              <div className="text-2xl font-bold text-cyan-900 mt-2">
                {liveVisitors}
              </div>
            </div>
          </div>

          {/* Visitor Insights */}
          <div className="bg-white rounded-xl border-2 border-blue-100 p-6 mb-8 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Visitor Insights</h3>
              <span className="text-sm text-slate-500">Synced from Supabase</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
                <div className="text-xs text-blue-600 font-semibold">Today</div>
                <div className="text-2xl font-bold text-blue-900 mt-1">{visitorStats.today}</div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 text-center">
                <div className="text-xs text-indigo-600 font-semibold">Yesterday</div>
                <div className="text-2xl font-bold text-indigo-900 mt-1">{visitorStats.yesterday}</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 text-center">
                <div className="text-xs text-purple-600 font-semibold">This Week</div>
                <div className="text-2xl font-bold text-purple-900 mt-1">{visitorStats.thisWeek}</div>
              </div>
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-100 text-center">
                <div className="text-xs text-pink-600 font-semibold">This Month</div>
                <div className="text-2xl font-bold text-pink-900 mt-1">{visitorStats.thisMonth}</div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-center">
                <div className="text-xs text-emerald-600 font-semibold">Total</div>
                <div className="text-2xl font-bold text-emerald-900 mt-1">{visitorStats.total}</div>
              </div>
              <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100 text-center">
                <div className="text-xs text-cyan-600 font-semibold">Live</div>
                <div className="text-2xl font-bold text-cyan-900 mt-1">{liveVisitors}</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-xl border-2 border-blue-100 p-6 mb-8 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Fundraising Progress
              </h3>
              <span className="text-2xl font-bold text-blue-600">
                {((stats.total_amount / FUNDRAISING_GOAL) * 100).toFixed(4)}%
              </span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.total_amount / FUNDRAISING_GOAL) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-slate-500 mt-3">
              <span>₹{stats.total_amount.toLocaleString("en-IN")} raised</span>
              <span>Remaining: ₹{(FUNDRAISING_GOAL - stats.total_amount).toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded">
              <p className="text-red-700 font-semibold">⚠️ {error}</p>
              <p className="text-red-600 text-sm mt-1">
                Make sure your Supabase URL and API key are correct in .env file
              </p>
            </div>
          )}

          {/* Status Breakdown */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200 text-center">
              <div className="text-sm text-emerald-600 font-semibold">Completed</div>
              <div className="text-3xl font-bold text-emerald-900 mt-2">{stats.completed}</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 text-center">
              <div className="text-sm text-yellow-600 font-semibold">Pending</div>
              <div className="text-3xl font-bold text-yellow-900 mt-2">{stats.pending}</div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200 text-center">
              <div className="text-sm text-red-600 font-semibold">Failed</div>
              <div className="text-3xl font-bold text-red-900 mt-2">{stats.failed}</div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by donor name, email, or payment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={20} className="text-slate-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Donations Table */}
          <div className="bg-white rounded-xl border-2 border-blue-100 overflow-hidden shadow-lg">
            {filteredDonations.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Heart size={32} className="text-blue-600" />
                </div>
                <p className="text-slate-600 text-lg font-semibold mb-2">No donations found</p>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  {donations.length === 0
                    ? "Start collecting donations! Share your donation link with supporters to see them appear here."
                    : "Try adjusting your search or filter to find what you're looking for."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-50 border-b-2 border-blue-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                        Donor
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                        Payment ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                        Date
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-800">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    {filteredDonations.map((donation) => (
                      <tr key={donation.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-slate-800">
                              {donation.donor_name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {donation.donor_email}
                            </div>
                            {donation.donor_phone && (
                              <div className="text-sm text-slate-500">
                                {donation.donor_phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          ₹{donation.amount?.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                          {donation.payment_id.substring(0, 12)}...
                        </td>
                        <td className="px-6 py-4">
                          {editingId === donation.id ? (
                            <select
                              value={editingStatus}
                              onChange={(e) =>
                                setEditingStatus(e.target.value as any)
                              }
                              className="px-3 py-1 text-sm border border-blue-300 rounded"
                            >
                              <option value="completed">Completed</option>
                              <option value="pending">Pending</option>
                              <option value="failed">Failed</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                donation.status
                              )}`}
                            >
                              {getStatusIcon(donation.status)}
                              {donation.status.charAt(0).toUpperCase() +
                                donation.status.slice(1)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(donation.created_at).toLocaleDateString(
                            "en-IN"
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            {editingId === donation.id ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(donation.id, editingStatus)
                                  }
                                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditDonation(donation)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Edit Donation"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(donation.id)}
                                  disabled={deleting === donation.id}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="mt-6 text-center text-sm text-slate-500">
            Showing {filteredDonations.length} of {donations.length} donations
          </div>
          </>
          )}

          {/* Contacts Tab */}
          {activeTab === "contacts" && (
            <>
              {contactsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {/* Contacts Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 text-center">
                      <div className="text-sm text-blue-600 font-semibold">New</div>
                      <div className="text-3xl font-bold text-blue-900 mt-2">
                        {contacts.filter(c => c.status === "new").length}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 text-center">
                      <div className="text-sm text-yellow-600 font-semibold">Read</div>
                      <div className="text-3xl font-bold text-yellow-900 mt-2">
                        {contacts.filter(c => c.status === "read").length}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 text-center">
                      <div className="text-sm text-green-600 font-semibold">Replied</div>
                      <div className="text-3xl font-bold text-green-900 mt-2">
                        {contacts.filter(c => c.status === "replied").length}
                      </div>
                    </div>
                  </div>

                  {/* Contacts Table */}
                  <div className="bg-white rounded-xl border-2 border-blue-100 overflow-hidden shadow-lg">
                    {contacts.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                          <MessageSquare size={32} className="text-blue-600" />
                        </div>
                        <p className="text-slate-600 text-lg font-semibold mb-2">No contacts yet</p>
                        <p className="text-slate-500 text-sm max-w-md mx-auto">
                          Contact form submissions will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-blue-50 border-b-2 border-blue-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                                Sender
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                                Subject
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                                Status
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                                Date
                              </th>
                              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-800">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-blue-100">
                            {contacts.map((contact) => (
                              <tr key={contact.id} className={`hover:bg-blue-50 transition-colors ${contact.status === "new" ? "bg-blue-50/50" : ""}`}>
                                <td className="px-6 py-4">
                                  <div>
                                    <div className="font-semibold text-slate-800">
                                      {contact.name}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                      {contact.email}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-slate-800 font-medium truncate max-w-[200px]">
                                    {contact.subject}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getContactStatusColor(contact.status || "new")}`}>
                                    {(contact.status || "new").charAt(0).toUpperCase() + (contact.status || "new").slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                  {contact.created_at ? new Date(contact.created_at).toLocaleDateString("en-IN") : "-"}
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <div className="flex justify-center gap-2">
                                    <button
                                      onClick={() => {
                                        setSelectedContact(contact);
                                        if (contact.status === "new" && contact.id) {
                                          handleContactStatusUpdate(contact.id, "read");
                                        }
                                      }}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                      title="View Message"
                                    >
                                      <Eye size={18} />
                                    </button>
                                    <a
                                      href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                                      onClick={() => contact.id && handleContactStatusUpdate(contact.id, "replied")}
                                      className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                                      title="Reply"
                                    >
                                      <Reply size={18} />
                                    </a>
                                    <button
                                      onClick={() => contact.id && handleDeleteContact(contact.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Results Summary */}
                  <div className="mt-6 text-center text-sm text-slate-500">
                    Total {contacts.length} contacts
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-blue-200 bg-white">
              <h2 className="text-2xl font-serif font-bold text-slate-800">
                Contact Message
              </h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Name</label>
                  <p className="text-slate-800 font-semibold">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
                  <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline font-semibold">
                    {selectedContact.email}
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Subject</label>
                <p className="text-slate-800 font-semibold">{selectedContact.subject}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Message</label>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-slate-700 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="text-sm text-slate-500">
                  Received: {selectedContact.created_at ? new Date(selectedContact.created_at).toLocaleString("en-IN") : "-"}
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedContact.status || "new"}
                    onChange={(e) => {
                      if (selectedContact.id) {
                        handleContactStatusUpdate(selectedContact.id, e.target.value as any);
                        setSelectedContact({ ...selectedContact, status: e.target.value as any });
                      }
                    }}
                    className="px-3 py-2 border border-blue-200 rounded-lg text-sm"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                    onClick={() => {
                      if (selectedContact.id) {
                        handleContactStatusUpdate(selectedContact.id, "replied");
                        setSelectedContact({ ...selectedContact, status: "replied" });
                      }
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Mail size={18} />
                    Reply
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Donation Modal */}
      {editingDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-blue-200 bg-white">
              <h2 className="text-2xl font-serif font-bold text-slate-800">
                Edit Donation
              </h2>
              <button
                onClick={() => {
                  setEditingDonation(null);
                  setEditFormData({});
                }}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Donor Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Donor Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Donor Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.donor_name || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          donor_name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editFormData.donor_email || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          donor_email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editFormData.donor_phone || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          donor_phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Donation Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Donation Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={editFormData.amount || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Currency
                    </label>
                    <input
                      type="text"
                      value={editFormData.currency || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          currency: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Payment ID
                    </label>
                    <input
                      type="text"
                      value={editFormData.payment_id || ""}
                      disabled
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Order ID
                    </label>
                    <input
                      type="text"
                      value={editFormData.order_id || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          order_id: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Status
                </h3>
                <select
                  value={editFormData.status || "pending"}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      status: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Service Info (Optional) */}
              {editFormData.service_name && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Service Information
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.service_name || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          service_name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-blue-200 bg-blue-50">
              <button
                onClick={() => {
                  setEditingDonation(null);
                  setEditFormData({});
                }}
                className="px-6 py-2 border-2 border-blue-300 text-slate-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDonation}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Pie Chart Modal */}
      {showPieChart && <PieChartComponent />}

      {/* Add Donation Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-blue-200 bg-white">
              <h2 className="text-2xl font-serif font-bold text-slate-800">
                Add New Donation
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Donor Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Donor Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Donor Name *
                    </label>
                    <input
                      type="text"
                      value={newDonationData.donor_name}
                      onChange={(e) =>
                        setNewDonationData({
                          ...newDonationData,
                          donor_name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter donor name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newDonationData.donor_email}
                      onChange={(e) =>
                        setNewDonationData({
                          ...newDonationData,
                          donor_email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="donor@email.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newDonationData.donor_phone}
                      onChange={(e) =>
                        setNewDonationData({
                          ...newDonationData,
                          donor_phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Donation Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Donation Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Amount (₹) *
                    </label>
                    <input
                      type="number"
                      value={newDonationData.amount || ""}
                      onChange={(e) =>
                        setNewDonationData({
                          ...newDonationData,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Currency
                    </label>
                    <select
                      value={newDonationData.currency}
                      onChange={(e) =>
                        setNewDonationData({
                          ...newDonationData,
                          currency: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Payment ID *
                    </label>
                    <input
                      type="text"
                      value={newDonationData.payment_id}
                      onChange={(e) =>
                        setNewDonationData({
                          ...newDonationData,
                          payment_id: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="pay_xxxxxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Order ID
                    </label>
                    <input
                      type="text"
                      value={newDonationData.order_id}
                      onChange={(e) =>
                        setNewDonationData({
                          ...newDonationData,
                          order_id: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="order_xxxxxxx"
                    />
                  </div>
                </div>
              </div>

              {/* Status and Service */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Status
                    </label>
                    <select
                      value={newDonationData.status}
                      onChange={(e) =>
                        setNewDonationData({
                          ...newDonationData,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Service Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={newDonationData.service_name}
                      onChange={(e) =>
                        setNewDonationData({
                          ...newDonationData,
                          service_name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="e.g., Education Support"
                    />
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-500">* indicates required fields</p>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-blue-200 bg-blue-50">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 border-2 border-blue-300 text-slate-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDonation}
                disabled={submitting}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Adding..." : "Add Donation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


