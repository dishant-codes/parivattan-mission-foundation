import { FormEvent, useState } from "react";
import { Heart, LoaderCircle, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createDonation } from "@/lib/supabase-admin";
import { getRazorpayKeyId, loadRazorpay } from "@/lib/razorpay";
import { toast } from "sonner";

export default function DonationCheckoutPage() {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", amount: "500" });
  const update = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.name || !form.email || !form.phone || !amount || amount < 1) { toast.error("Please enter valid donor details and an amount."); return; }
    setBusy(true);
    try {
      await loadRazorpay();
      const key = getRazorpayKeyId();
      if (!key || !window.Razorpay) throw new Error("Payment gateway is not configured.");
      new window.Razorpay({ key, amount: Math.round(amount * 100), currency: "INR", name: "Parivattan Mission Foundation", description: "Donation", prefill: { name: form.name, email: form.email, contact: form.phone }, theme: { color: "#b5623b" }, handler: async (response: { razorpay_payment_id: string }) => {
        try {
          await createDonation({ amount, currency: "INR", payment_id: response.razorpay_payment_id, order_id: "", donor_name: form.name, donor_email: form.email, donor_phone: form.phone, status: "completed" });
          toast.success("Thank you. Your donation has been recorded.");
          setForm({ name: "", email: "", phone: "", amount: "500" });
        } catch { toast.error("Payment succeeded, but we could not record the donation. Please contact us with your payment ID."); }
        setBusy(false);
      }, modal: { ondismiss: () => setBusy(false) } }).open();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to start payment."); setBusy(false); }
  };
  return <div className="min-h-screen bg-[#fbfaf7] text-[#24312d]"><Header /><main className="page-section pt-36"><div className="mx-auto max-w-5xl"><div className="max-w-3xl"><p className="eyebrow">Give with intention</p><h1 className="mt-4 text-5xl font-serif leading-[1.05] md:text-7xl">Your generosity makes room for possibility.</h1><p className="mt-7 text-xl text-[#65706a]">Every contribution helps us keep learning spaces open, support mentors and make practical education more accessible.</p></div><form onSubmit={submit} className="mt-14 grid gap-6 rounded-3xl bg-[#24312d] p-7 text-white shadow-xl md:grid-cols-2 md:p-10"><div className="md:col-span-2 flex items-center gap-3"><Heart className="text-[#e5a37f]" /><h2 className="text-2xl font-serif">Make a donation</h2></div><Field label="Your name" value={form.name} onChange={value => update("name", value)} /><Field label="Email address" type="email" value={form.email} onChange={value => update("email", value)} /><Field label="Phone number" value={form.phone} onChange={value => update("phone", value)} /><Field label="Amount (INR)" type="number" value={form.amount} onChange={value => update("amount", value)} /><button disabled={busy} className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#e5a37f] px-6 py-4 font-semibold text-[#24312d] disabled:opacity-60">{busy ? <LoaderCircle className="animate-spin" size={18} /> : <Heart size={18} />} {busy ? "Opening secure payment..." : "Continue to secure payment"}</button><p className="md:col-span-2 flex items-center justify-center gap-2 text-center text-sm text-white/65"><ShieldCheck size={16} /> Your donation is saved only after Razorpay confirms success.</p></form></div></main><Footer /></div>;
}
function Field({ label, type = "text", value, onChange }: { label: string; type?: string; value: string; onChange: (value: string) => void }) { return <label className="field"><span>{label}</span><input required type={type} min={type === "number" ? "1" : undefined} value={value} onChange={event => onChange(event.target.value)} /></label>; }
