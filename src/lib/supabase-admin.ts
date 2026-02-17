import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Visitor Types
export interface VisitorStats {
  today: number;
  yesterday: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
}

// Donation Types
export interface Donation {
  id: string;
  amount: number;
  currency: string;
  payment_id: string;
  order_id: string;
  service_id?: string;
  service_name?: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  status: "pending" | "completed" | "failed";
  created_at: string;
  updated_at: string;
}

// Get all donations
export const getAllDonations = async (): Promise<Donation[]> => {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

// Get donations by status
export const getDonationsByStatus = async (
  status: string
): Promise<Donation[]> => {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

// Search donations by donor name or email
export const searchDonations = async (query: string): Promise<Donation[]> => {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .or(
      `donor_name.ilike.%${query}%,donor_email.ilike.%${query}%,payment_id.ilike.%${query}%`
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

// Get donation by ID
export const getDonationById = async (id: string): Promise<Donation | null> => {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

// Update donation status
export const updateDonationStatus = async (
  id: string,
  status: "pending" | "completed" | "failed"
): Promise<Donation> => {
  const { data, error } = await supabase
    .from("donations")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Create donation
export const createDonation = async (
  donationData: Omit<Donation, "id" | "created_at" | "updated_at">
): Promise<Donation> => {
  const { data, error } = await supabase
    .from("donations")
    .insert([
      {
        ...donationData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete donation
export const deleteDonation = async (id: string): Promise<void> => {
  const { error } = await supabase.from("donations").delete().eq("id", id);

  if (error) throw error;
};

// Get donation statistics
export const getDonationStats = async () => {
  const { data, error } = await supabase
    .from("donations")
    .select("amount, status, created_at");

  if (error) throw error;

  const stats = {
    total_donations: data?.length || 0,
    total_amount: data?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0,
    completed: data?.filter((d) => d.status === "completed").length || 0,
    pending: data?.filter((d) => d.status === "pending").length || 0,
    failed: data?.filter((d) => d.status === "failed").length || 0,
  };

  return stats;
};

// Get monthly donation stats
export const getMonthlyStats = async () => {
  const { data, error } = await supabase
    .from("donations")
    .select("amount, created_at");

  if (error) throw error;

  const monthlyData: Record<string, number> = {};

  data?.forEach((donation) => {
    const date = new Date(donation.created_at);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (donation.amount || 0);
  });

  return Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount,
  }));
};

// Admin authentication - verify admin password
export const verifyAdminPassword = (password: string): boolean => {
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  return password === adminPassword;
};

// Set admin auth in sessionStorage (more secure than localStorage)
export const setAdminAuth = () => {
  const token = btoa(crypto.randomUUID() + new Date().getTime().toString());
  sessionStorage.setItem("adminToken", token);
  sessionStorage.setItem("adminAuthTime", new Date().getTime().toString());
  // Also set a flag to track active session
  sessionStorage.setItem("adminSessionActive", "true");
};

// Get admin auth status
export const getAdminAuth = (): boolean => {
  const token = sessionStorage.getItem("adminToken");
  const authTime = sessionStorage.getItem("adminAuthTime");
  const sessionActive = sessionStorage.getItem("adminSessionActive");

  if (!token || !authTime || sessionActive !== "true") return false;

  // Check if auth is older than 2 hours (more secure)
  const now = new Date().getTime();
  const authTimeNum = parseInt(authTime);
  const twoHoursMs = 2 * 60 * 60 * 1000;

  if (now - authTimeNum > twoHoursMs) {
    clearAdminAuth();
    return false;
  }

  return true;
};

// Clear admin auth completely
export const clearAdminAuth = () => {
  sessionStorage.removeItem("adminToken");
  sessionStorage.removeItem("adminAuthTime");
  sessionStorage.removeItem("adminSessionActive");
  // Clear any cached data
  sessionStorage.clear();
};

// Contact Types
export interface Contact {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: "new" | "read" | "replied";
  created_at?: string;
}

// Create contact submission
export const createContact = async (
  contactData: Omit<Contact, "id" | "created_at" | "status">
): Promise<Contact> => {
  const { data, error } = await supabase
    .from("contacts")
    .insert([
      {
        ...contactData,
        status: "new",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get all contacts
export const getAllContacts = async (): Promise<Contact[]> => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

// Update contact status
export const updateContactStatus = async (
  id: string,
  status: "new" | "read" | "replied"
): Promise<Contact> => {
  const { data, error } = await supabase
    .from("contacts")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete contact
export const deleteContact = async (id: string): Promise<void> => {
  const { error } = await supabase.from("contacts").delete().eq("id", id);

  if (error) throw error;
};

// Track a visitor session
export const logVisitor = async (payload: {
  session_id: string;
  path?: string;
  referrer?: string | null;
  user_agent?: string;
}): Promise<void> => {
  const { error } = await supabase.from("visitors").insert([
    {
      session_id: payload.session_id,
      path: payload.path,
      referrer: payload.referrer,
      user_agent: payload.user_agent,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) throw error;
};

// Aggregate visitor statistics
export const getVisitorStats = async (): Promise<VisitorStats> => {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const startOfWeek = new Date(startOfToday);
  const day = startOfWeek.getDay();
  const diffToMonday = (day === 0 ? 6 : day - 1);
  startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);

  const startOfMonth = new Date(startOfToday);
  startOfMonth.setDate(1);

  const countRange = async (from?: Date, to?: Date) => {
    let query = supabase.from("visitors").select("id", { count: "exact", head: true });
    if (from) query = query.gte("created_at", from.toISOString());
    if (to) query = query.lt("created_at", to.toISOString());
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  };

  const [today, yesterday, thisWeek, thisMonth, total] = await Promise.all([
    countRange(startOfToday),
    countRange(startOfYesterday, startOfToday),
    countRange(startOfWeek),
    countRange(startOfMonth),
    countRange(),
  ]);

  return { today, yesterday, thisWeek, thisMonth, total };
};
