/// <reference types="vite/client" />

interface Window {
	Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
}

interface ImportMetaEnv {
	readonly VITE_RAZORPAY_KEY_ID?: string;
	readonly RAZORPAY_KEY_ID?: string;
}
