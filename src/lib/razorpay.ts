
// NOTE: For security, do NOT use real secret keys in production frontend code!
// This is for demo/dev only. Use env vars or a backend proxy for real apps.
const RAZORPAY_KEY_ID = "rzp_live_Roni2CefdMucNL"; // Replace with your test key id
const RAZORPAY_KEY_SECRET = "U746ODhIxbHINOSXaB6kUsQN"; // Replace with your test key secret

export const fetchRazorpaySubscriptionsCount = async () => {
  try {
    const credentials = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    const response = await fetch("https://api.razorpay.com/v1/subscriptions", {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data.items) ? data.items.length : 0;
  } catch (error) {
    console.error("Error fetching Razorpay subscriptions count:", error);
    return 0;
  }
};
