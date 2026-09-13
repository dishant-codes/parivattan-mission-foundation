import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createAdmission } from "@/lib/supabase-admin";
import { getRazorpayKeyId, loadRazorpay } from "@/lib/razorpay";
import { toast } from "sonner";

const programs = ["Parivattan Overseas Schools - IELTS / TOEFL / PTE", "Parivattan Foreign Language School", "Parivattan Technology School"];

export default function AdmissionsPage() {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", program: programs[0], message: "" });
  const update = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.phone) { toast.error("Please complete your name, email and phone number."); return; }
    setBusy(true);
    try {
      await loadRazorpay();
      const key = getRazorpayKeyId();
      if (!key || !window.Razorpay) throw new Error("Payment gateway is not configured.");
      new window.Razorpay({ key, amount: 50000, currency: "INR", name: "Parivattan Mission Foundation", description: "Admission registration fee", prefill: { name: form.name, email: form.email, contact: form.phone }, theme: { color: "#b5623b" }, handler: async (response: { razorpay_payment_id: string }) => {
        try {
          await createAdmission({ ...form, amount: 500, payment_id: response.razorpay_payment_id, status: "completed" });
          toast.success("Application submitted successfully. We will contact you soon.");
          setForm({ name: "", email: "", phone: "", program: programs[0], message: "" });
        } catch { toast.error("Payment succeeded, but we could not save the application. Please contact us with your payment ID."); }
        setBusy(false);
      }, modal: { ondismiss: () => setBusy(false) } }).open();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to start payment."); setBusy(false); }
  };

  return <div className="min-h-screen bg-[#fbfaf7] text-[#24312d]"><Header /><main className="page-section pt-36"><div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"><div><p className="eyebrow">Admissions 2026</p><h1 className="mt-4 text-5xl font-serif leading-[1.05] md:text-7xl">Begin with a curious mind.</h1><p className="mt-7 text-lg text-[#65706a]">Tell us what you want to learn. A one-time registration fee of ₹500 is collected securely through Razorpay. Your application is stored only after payment succeeds.</p><div className="mt-10 space-y-4 text-[#65706a]"><p className="flex gap-3"><CheckCircle2 className="shrink-0 text-[#b5623b]" /> Human support from application to enrolment</p><p className="flex gap-3"><CheckCircle2 className="shrink-0 text-[#b5623b]" /> Programs designed around practical outcomes</p><p className="flex gap-3"><ShieldCheck className="shrink-0 text-[#b5623b]" /> Secure payment processing</p></div></div><form onSubmit={submit} className="rounded-3xl bg-white p-7 shadow-sm md:p-10"><div className="grid gap-5 md:grid-cols-2"><Field label="Full name" value={form.name} onChange={value => update("name", value)} /><Field label="Email address" type="email" value={form.email} onChange={value => update("email", value)} /><Field label="Phone number" value={form.phone} onChange={value => update("phone", value)} /><label className="field"><span>Program</span><select value={form.program} onChange={e => update("program", e.target.value)}>{programs.map(program => <option key={program}>{program}</option>)}</select></label></div><label className="field mt-5"><span>What would you like us to know?</span><textarea rows={5} value={form.message} onChange={e => update("message", e.target.value)} placeholder="Your goals, preferred schedule or questions" /></label><button disabled={busy} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#b5623b] px-6 py-4 font-semibold text-white transition hover:bg-[#954b2c] disabled:opacity-60">{busy ? <LoaderCircle className="animate-spin" size={18} /> : <ArrowRight size={18} />} {busy ? "Opening secure payment..." : "Continue to payment · ₹500"}</button><p className="mt-4 text-center text-xs text-[#65706a]">Payment is required to complete registration. No application is saved for failed or cancelled payments.</p><Link to="/" className="mt-5 block text-center text-sm font-semibold text-[#b5623b]">Return to home</Link></form></div></main><Footer /></div>;
}

function Field({ label, type = "text", value, onChange }: { label: string; type?: string; value: string; onChange: (value: string) => void }) { return <label className="field"><span>{label}</span><input required type={type} value={value} onChange={event => onChange(event.target.value)} /></label>; }
