/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminContent from "../adminContent.js";
import type * as adminCustomers from "../adminCustomers.js";
import type * as adminDashboard from "../adminDashboard.js";
import type * as adminFleet from "../adminFleet.js";
import type * as adminInbox from "../adminInbox.js";
import type * as adminPricing from "../adminPricing.js";
import type * as adminReports from "../adminReports.js";
import type * as adminReservations from "../adminReservations.js";
import type * as adminUsers from "../adminUsers.js";
import type * as auth from "../auth.js";
import type * as bookings from "../bookings.js";
import type * as bootstrap from "../bootstrap.js";
import type * as http from "../http.js";
import type * as inbox from "../inbox.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_bookings from "../lib/bookings.js";
import type * as lib_validators from "../lib/validators.js";
import type * as public_ from "../public.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminContent: typeof adminContent;
  adminCustomers: typeof adminCustomers;
  adminDashboard: typeof adminDashboard;
  adminFleet: typeof adminFleet;
  adminInbox: typeof adminInbox;
  adminPricing: typeof adminPricing;
  adminReports: typeof adminReports;
  adminReservations: typeof adminReservations;
  adminUsers: typeof adminUsers;
  auth: typeof auth;
  bookings: typeof bookings;
  bootstrap: typeof bootstrap;
  http: typeof http;
  inbox: typeof inbox;
  "lib/auth": typeof lib_auth;
  "lib/bookings": typeof lib_bookings;
  "lib/validators": typeof lib_validators;
  public: typeof public_;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
