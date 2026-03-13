- Workspace facts:
- This repo is a single React + Vite + TypeScript app with Tailwind CSS and React Router.
- Public site content is served from Firestore; `FirebaseBootstrapper` seeds initial data via the client SDK using an `isFirstSeed()` security rule (no Blaze plan required for seeding).
- Public booking and manage-booking flows are frontend-only and WhatsApp-driven. Contact lead, complaint, and newsletter submissions go through Cloud Functions with server-side validation.
- Git remote origin is https://github.com/leocode09/petercarrental.git.
- Admin portal is at /admin with auth removed (static superAdmin, no login/setup routes).
- Auth and database use Firebase. Required env vars (in .env.local):
  - VITE_FIREBASE_API_KEY
  - VITE_FIREBASE_AUTH_DOMAIN
  - VITE_FIREBASE_PROJECT_ID
  - VITE_FIREBASE_STORAGE_BUCKET
  - VITE_FIREBASE_MESSAGING_SENDER_ID
  - VITE_FIREBASE_APP_ID
  - VITE_FIREBASE_MEASUREMENT_ID (optional, for Analytics)
  - VITE_SITE_URL – frontend origin, e.g. http://127.0.0.1:4173
  - VITE_USE_FIREBASE_EMULATORS – set to "true" to connect the Functions emulator (port 5001) for local dev without the Blaze plan.
- Firebase Hosting is configured in `firebase.json` (`dist/` with SPA rewrites). Deployed at https://peter-car-rental.web.app.
- Also deployed to Vercel at petercarrental.dime.rw.
- `firestore.indexes.json` should only contain composite indexes; Firestore creates single-field indexes automatically.
- In PowerShell, quote comma-separated `--only` lists for the Firebase CLI (e.g. `firebase deploy --only "hosting,firestore"`).
- Uses Tailwind v4; custom base/component CSS must go in `@layer base` / `@layer components` to avoid overriding utility classes.
- Form labels use a consistent pattern: `<label>` wrapping `<span className="text-sm font-semibold text-slate-700">`.

- Firebase setup:
  1. Create a Firestore database.
  2. Cloud Functions require the Blaze plan; upgrade in Firebase Console if deploy fails.
  3. Deploy Cloud Functions: `npm run firebase:deploy:functions` (runs copy-seed-data and builds before deploy).
  4. Add your domain to Firebase Auth authorized domains.

- User preferences:
- Prefer fully functional, end-to-end implementations over placeholder scaffolding when the task scope allows.
- When fixing vehicle images, verify both that the image loads and that it actually matches the intended vehicle type.
- When using companyInfo in admin pages, guard for undefined (e.g. `companyInfo?.name ?? "Peter Car Rental"`) since site settings may not be loaded yet.
