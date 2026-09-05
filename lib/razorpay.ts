export type RazorpayMode = "test" | "live";

export function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const mode = (process.env.RAZORPAY_MODE ||
    (keyId?.startsWith("rzp_live_") ? "live" : "test")) as RazorpayMode;

  if (!keyId || !keySecret || (mode !== "test" && mode !== "live")) {
    return null;
  }
  const expectedPrefix = mode === "live" ? "rzp_live_" : "rzp_test_";
  if (!keyId.startsWith(expectedPrefix)) return null;
  return { keyId, keySecret, mode };
}
