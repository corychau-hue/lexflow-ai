"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 shadow-lg mb-4">
            <Scale size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">LexFlow AI</h1>
          <p className="text-slate-500 mt-1">Legal Workflow Platform</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-danger-50 border border-danger-100 text-sm text-danger-600">
                  {error}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                placeholder="you@lawfirm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-xs font-medium text-slate-500 mb-2">Demo Credentials</p>
              <div className="space-y-1 text-xs text-slate-400">
                <p><strong>Admin:</strong> admin@lexflow.com / password123</p>
                <p><strong>Attorney:</strong> attorney@lexflow.com / password123</p>
                <p><strong>Paralegal:</strong> paralegal@lexflow.com / password123</p>
                <p><strong>Intake:</strong> intake@lexflow.com / password123</p>
                <p><strong>Client:</strong> client@lexflow.com / password123</p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700">
                <strong>Confidentiality Notice:</strong> This system contains confidential client information.
                Authorized users only. Unauthorized access is prohibited.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
