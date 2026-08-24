// Type declarations for static asset imports
declare module "*.css";
declare module "*.scss";
declare module "*.sass";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";

interface RazorpayCheckout {
  open(): void;
  on(event: string, callback: () => void): void;
}

interface Window {
  Razorpay: new (options: {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill?: { email: string };
    handler: (payment: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => Promise<void>;
    modal?: { ondismiss: () => void };
  }) => RazorpayCheckout;
}
