/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as contact from "../contact.js";
import type * as contactSubscription from "../contactSubscription.js";
import type * as donation from "../donation.js";
import type * as email from "../email.js";
import type * as http from "../http.js";
import type * as lib_email from "../lib/email.js";
import type * as lib_emails from "../lib/emails.js";
import type * as model from "../model.js";
import type * as newsletterSubscriber from "../newsletterSubscriber.js";
import type * as stripe from "../stripe.js";
import type * as stripeEvent from "../stripeEvent.js";
import type * as stripeEventAction from "../stripeEventAction.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  contact: typeof contact;
  contactSubscription: typeof contactSubscription;
  donation: typeof donation;
  email: typeof email;
  http: typeof http;
  "lib/email": typeof lib_email;
  "lib/emails": typeof lib_emails;
  model: typeof model;
  newsletterSubscriber: typeof newsletterSubscriber;
  stripe: typeof stripe;
  stripeEvent: typeof stripeEvent;
  stripeEventAction: typeof stripeEventAction;
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
