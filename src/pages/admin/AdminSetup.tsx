import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useAuth, useCallable } from "../../lib/auth-context";
import { useAuthState } from "../../lib/useAuthState";
import { usePublicSiteData } from "../../lib/publicData";
import { inputClassName } from "../../lib/utils";

type CreateFirstAdminResult = { data?: { userId: string } };

export default function AdminSetup() {
  const navigate = useNavigate();
  const { companyInfo } = usePublicSiteData();
  const { signIn } = useAuth();
  const authState = useAuthState();
  const createFirstAdmin = useCallable<
    { name: string; email: string; password: string },
    CreateFirstAdminResult
  >("createFirstAdmin");
  const [name, setName] = useState("Peter Car Rental Admin");
  const [email, setEmail] = useState("admin@petercarrental.rw");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authState.hasAnyAdmin && !authState.loading) {
      navigate(authState.viewer?.role ? "/admin" : "/admin/login", { replace: true });
    }
  }, [authState.hasAnyAdmin, authState.viewer?.role, authState.loading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-10">
      <Card className="w-full max-w-xl p-8">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">Initial Setup</p>
          <h1 className="text-3xl font-black tracking-[-0.03em] text-slate-950">Create the first super admin</h1>
          <p className="text-sm leading-6 text-slate-600">
            This one-time step secures the {companyInfo?.name ?? "Peter Car Rental"} admin portal and unlocks the full fleet, bookings,
            content, pricing, inbox, and reporting workflow.
          </p>
        </div>

        <form
          className="mt-8 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setErrorMessage("");

            if (password !== confirmPassword) {
              setErrorMessage("Passwords do not match.");
              return;
            }

            setSubmitting(true);

            try {
              await createFirstAdmin({
                email: email.trim().toLowerCase(),
                name,
                password,
              });

              await signIn(email.trim().toLowerCase(), password);

              navigate("/admin", { replace: true });
            } catch (error) {
              const msg = error instanceof Error ? error.message : "Unable to create the admin account.";
              const isNetworkError =
                msg.includes("404") ||
                msg.includes("CORS") ||
                msg.includes("Failed to fetch") ||
                msg.toLowerCase().includes("network");
              setErrorMessage(
                isNetworkError
                  ? "Could not reach the server. Have you deployed Cloud Functions? Run: npm run firebase:deploy:functions"
                  : msg
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Display name</span>
            <input
              className={inputClassName}
              onChange={(event) => setName(event.target.value)}
              placeholder="Peter Car Rental Admin"
              required
              type="text"
              value={name}
            />
          </label>

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
              placeholder="At least 8 characters"
              required
              type="password"
              value={password}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Confirm password</span>
            <input
              className={inputClassName}
              minLength={8}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat the password"
              required
              type="password"
              value={confirmPassword}
            />
          </label>

          {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Button disabled={submitting} type="submit">
              {submitting ? "Creating Admin..." : "Create Super Admin"}
            </Button>
            <Button to="/" variant="outline">
              Back To Website
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
