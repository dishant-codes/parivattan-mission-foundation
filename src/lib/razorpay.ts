
export const getRazorpayKeyId = () => import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.RAZORPAY_KEY_ID;

export const loadRazorpay = () => new Promise<void>((resolve, reject) => {
  if (window.Razorpay) {
    resolve();
    return;
  }

  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => resolve();
  script.onerror = () => reject(new Error("Unable to load Razorpay checkout."));
  document.body.appendChild(script);
});

export const fetchRazorpaySubscriptionsCount = async () => 0;
