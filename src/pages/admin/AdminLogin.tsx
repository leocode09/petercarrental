import { useConvexAuth, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { authClient } from "../../lib/auth-client";
import { inputClassName } from "../../lib/utils";
import { usePublicSiteData } from "../../lib/publicData";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { companyInfo } = usePublicSiteData();
  const { isAuthenticated } = useConvexAuth();
  const authState = useQuery(api.adminUsers.authState, {});
  const [email, setEmail] = useState("admin@petercarrental.rw");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const nextPath = (location.state as { from?: string } | null)?.from || "/admin";
      navigate(nextPath, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  if (authState?.hasAnyAdmin === false) {
    navigate("/admin/setup", { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-10">
      <Card className="w-full max-w-lg p-8">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">Admin Sign In</p>
          <h1 className="text-3xl font-black tracking-[-0.03em] text-slate-950">{companyInfo.name} operations portal</h1>
          <p className="text-sm leading-6 text-slate-600">
            Sign in to manage bookings, fleet availability, pricing, content, inbox workflows, and reporting.
          </p>
        </div>

        <form
          className="mt-8 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setSubmitting(true);
            setErrorMessage("");

            try {
              const result = await authClient.signIn.email({
                email,
                password,
              });

              if (result.error) {
                setErrorMessage(result.error.message || "Unable to sign in.");
              }
            } catch (error) {
              setErrorMessage(error instanceof Error ? error.message : "Unable to sign in.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Admin email</span>
            <input
              className={inputClassName}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@petercarrental.rw"
              required
              type="email"
              value={email}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Password</span>
            <input
              className={inputClassName}
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              type="password"
              value={password}
            />
          </label>

          {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Button disabled={submitting} type="submit">
              {submitting ? "Signing In..." : "Sign In"}
            </Button>
            <Button to="/" variant="outline">
              Back To Website
            </Button>
          </div>
        </form>

        {!authState?.hasAnyAdmin ? (
          <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm text-slate-700">
            No admin account exists yet. Use the setup page to create the first super admin.
          </div>
        ) : null}
      </Card>
    </div>
  );
}
