import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const locale = v.union(v.literal("en"), v.literal("nl"));
const address = v.object({
  line1: v.optional(v.string()),
  line2: v.optional(v.string()),
  city: v.optional(v.string()),
  postalCode: v.optional(v.string()),
  country: v.optional(v.string()),
});

const schema = defineSchema({
  contact: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    locale: v.optional(locale),
    address: v.optional(address),
    firstSource: v.union(v.literal("contact"), v.literal("newsletter"), v.literal("stripe")),
    lastSource: v.union(v.literal("contact"), v.literal("newsletter"), v.literal("stripe")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  donationSubscription: defineTable({
    contactId: v.id("contact"),
    stripeSubscriptionId: v.string(),
    stripeEventId: v.string(),
    lastStripeEventCreatedAt: v.number(),
    status: v.string(),
    cancelAtPeriodEnd: v.boolean(),
    purpose: v.string(),
    amount: v.number(),
    currency: v.string(),
    stripePriceId: v.string(),
    stripeProductId: v.optional(v.string()),
    quantity: v.number(),
    validFrom: v.number(),
    validTo: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_stripe_event", ["stripeEventId"])
    .index("by_contact_and_valid_to", ["contactId", "validTo"]),

  donation: defineTable({
    contactId: v.id("contact"),
    stripeEventId: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    stripeInvoiceId: v.optional(v.string()),
    stripeCheckoutSessionId: v.optional(v.string()),
    purpose: v.string(),
    frequency: v.union(v.literal("monthly"), v.literal("once")),
    amount: v.number(),
    currency: v.string(),
    status: v.union(v.literal("paid"), v.literal("partially_refunded"), v.literal("refunded")),
    refundedAmount: v.number(),
    paidAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_stripe_event", ["stripeEventId"])
    .index("by_payment_intent", ["stripePaymentIntentId"])
    .index("by_invoice", ["stripeInvoiceId"])
    .index("by_checkout_session", ["stripeCheckoutSessionId"])
    .index("by_contact_paid_at", ["contactId", "paidAt"]),

  newsletterSubscriber: defineTable({
    contactId: v.id("contact"),
    status: v.union(v.literal("pending"), v.literal("active"), v.literal("unsubscribed")),
    consentedAt: v.optional(v.number()),
    subscribedAt: v.number(),
    unsubscribedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_contact", ["contactId"]),

  stripeEvents: defineTable({
    eventId: v.string(),
    type: v.string(),
    processedAt: v.number(),
  }).index("by_event_id", ["eventId"]),
});

export default schema;
