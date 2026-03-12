- Workspace facts:
- This repo is a single React + Vite + TypeScript app with Tailwind CSS and React Router.
- Most public site content still comes from src/data/*.ts.
- Public booking, manage-booking, contact, and complaint flows are frontend-only and WhatsApp-driven unless they are explicitly migrated to a backend.
- Git remote origin is https://github.com/leocode09/petercarrental.git.
- Admin portal is at /admin/login; first-time setup at /admin/setup creates the initial super admin.
- Auth and database use Firebase (Firebase Auth + Firestore). Required env vars (in .env.local):
  - VITE_FIREBASE_API_KEY
  - VITE_FIREBASE_AUTH_DOMAIN
  - VITE_FIREBASE_PROJECT_ID
  - VITE_FIREBASE_STORAGE_BUCKET
  - VITE_FIREBASE_MESSAGING_SENDER_ID
  - VITE_FIREBASE_APP_ID
  - VITE_FIREBASE_MEASUREMENT_ID (optional, for Analytics)
  - VITE_SITE_URL – frontend origin, e.g. http://127.0.0.1:4173

- Firebase setup:
  1. Enable Authentication (Email/Password) in Firebase Console.
  2. Create a Firestore database.
  3. Deploy Cloud Functions: `npm run firebase:deploy:functions` (runs copy-seed-data and builds before deploy).
  4. Add your domain to Firebase Auth authorized domains.

- User preferences:
- Prefer fully functional, end-to-end implementations over placeholder scaffolding when the task scope allows.
- When fixing vehicle images, verify both that the image loads and that it actually matches the intended vehicle type.
