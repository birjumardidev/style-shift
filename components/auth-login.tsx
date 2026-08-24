"use client";

import { useState } from "react";
import { Loader2, Wand2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";

export function AuthLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signIn } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await signIn(email, password);
      setSuccess("Logged in successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Authentication failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 lg:p-8">
      {/* Background decoration */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 70%)`,
        }}
      />

      <div className="relative w-full max-w-md lg:max-w-lg">
        {/* Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/50 lg:rounded-3xl lg:p-10">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center text-center lg:mb-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/25 lg:h-14 lg:w-14">
              <Wand2 className="h-6 w-6 text-white lg:h-7 lg:w-7" />
            </span>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900 lg:text-3xl">
              Admin Access
            </h1>
            <p className="mt-1.5 text-sm text-neutral-500 lg:text-base">
              Sign in to your RemixKit account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-neutral-700 lg:text-base"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-11 rounded-xl border-neutral-200 bg-neutral-50 text-sm focus-visible:ring-violet-500/20 focus-visible:border-violet-400 lg:h-12 lg:text-base lg:rounded-2xl"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-neutral-700 lg:text-base"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-11 rounded-xl border-neutral-200 bg-neutral-50 pr-11 text-sm focus-visible:ring-violet-500/20 focus-visible:border-violet-400 lg:h-12 lg:text-base lg:rounded-2xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 lg:h-5 lg:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 lg:h-5 lg:w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <Alert
                variant="destructive"
                className="rounded-xl border-red-200 bg-red-50 lg:rounded-2xl"
              >
                <AlertDescription className="text-sm text-red-700 lg:text-base">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Success */}
            {success && (
              <Alert className="rounded-xl border-emerald-200 bg-emerald-50 lg:rounded-2xl">
                <AlertDescription className="text-sm text-emerald-700 lg:text-base">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-violet-600 text-sm font-semibold text-white shadow-md shadow-violet-600/20 transition-all hover:bg-violet-700 hover:shadow-violet-600/30 disabled:opacity-60 lg:h-12 lg:text-base lg:rounded-2xl"
              disabled={loading || !email || !password}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
