/**
 * Generates JWT_PRIVATE_KEY and JWKS for Convex Auth.
 * Run: npm run auth:generate-keys
 *
 * Add both variables to your Convex deployment:
 * https://dashboard.convex.dev/deployment/settings/environment-variables
 *
 * 1. Run this script and copy the two output lines
 * 2. In Convex Dashboard → Deployment → Environment Variables
 * 3. Add JWT_PRIVATE_KEY (paste the full value including quotes)
 * 4. Add JWKS (paste the full JSON value)
 */
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

const keys = await generateKeyPair("RS256", { extractable: true });
const privateKey = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

process.stdout.write(
  `JWT_PRIVATE_KEY="${privateKey.trimEnd().replace(/\n/g, " ")}"`
);
process.stdout.write("\n");
process.stdout.write(`JWKS=${jwks}`);
process.stdout.write("\n");
process.stderr.write(
  "\n→ Add these to https://dashboard.convex.dev/deployment/settings/environment-variables\n"
);
