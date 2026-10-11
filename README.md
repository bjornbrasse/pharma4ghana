This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

`npm run dev` starts Convex development and the Next.js development server together.
Convex prepares its deployment and generated types before starting Next.js, then watches for
backend changes while Next.js runs. Use `npm run dev:next` to start only Next.js, or
`npm run convex:dev` to start only Convex. The Playwright development suite uses `dev:next`
so it does not start a Convex watcher.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Stripe donations

The app includes a localized donation flow at `/en/donate` and `/nl/donate` using Stripe Checkout.

Copy the environment template before testing payments:

```bash
cp .env.example .env.local
```

Configure Stripe, Convex, and a shared server-to-Convex secret. Keep donations disabled until those
values have been verified:

```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_SYNC_SECRET=generate_a_long_random_secret
NEXT_PUBLIC_DONATIONS_ENABLED=false
```

Set `NEXT_PUBLIC_DONATIONS_ENABLED=true` only when the Stripe and receipt configuration is ready.
The receipt page and PDF are available only when Stripe reports the donation as paid.
Submitting a valid donation opens Stripe Checkout in a new tab, leaving the donation page open.
Allow new tabs/popups for the site; blocked tabs and checkout failures show an error on the form.
In development, the donation page remains accessible when donations are disabled so the interface
can be reviewed; checkout remains disabled. In production, the disabled donation page redirects to
the localized home page and the checkout API returns `503`.

### Monthly donation products

Monthly Checkout uses the existing Stripe product IDs in `src/lib/donation-options.ts`:

| Option | Monthly amount | Stripe product |
| --- | --- | --- |
| Materials | EUR 10 | `prod_VQD6H1KreEXuxe` |
| Computer | EUR 25 | `prod_VQD8ppvD8w0QDA` |
| Student | EUR 40 | `prod_VQDANH8xfnZjUt` |
| Custom | Donor-entered amount | `prod_VQ7q4uWIuTJeNR` |

Checkout creates a monthly EUR price for the selected product and validated amount, rather than
creating a new product on each checkout. One-time donations retain their existing inline product
details. Product IDs must exist in the same Stripe account and test/live mode as `STRIPE_SECRET_KEY`;
replace the mapping with live-mode product IDs before using a live key.

When the portal changes a subscription's product, the webhook determines its current purpose
from this mapping, not the original Checkout metadata. Subscription history also stores the
Stripe product ID. Legacy products continue to use their original purpose metadata.

### Manage monthly donations

Enable the hosted Customer Portal login link in Stripe Dashboard under **Settings → Billing →
Customer portal**, and enable the payment-detail and subscription-cancellation features donors
should be allowed to use.

Set `STRIPE_CUSTOMER_PORTAL_URL` to the full `https://billing.stripe.com/p/login/...` login URL
(not the `bpc_...` configuration ID). The footer shows a localized English/Dutch management section
when this variable is configured. Stripe verifies access using the donor's email address; the app
does not accept unverified customer IDs or create portal sessions itself.

Use a `test_...` login URL only for test-mode donations. Set a live-mode login URL in the production
environment before building/deploying the site. Leave the variable empty to hide the section.
Portal changes to subscriptions are synchronized through the existing Stripe subscription webhooks.

## Convex donor management

Create or connect a Convex deployment:

```bash
npm run convex:dev
```

The Convex schema contains five application tables:

- `contact`: normalized identities shared by contact, newsletter, and donor records.
- `donor`: Stripe customer and current monthly-subscription information.
- `donationSubscription`: versioned monthly subscriptions linked to a donor, including amount
  (in cents), price, quantity, status, cancellation setting, and `validFrom`/`validTo` timestamps.
- `donation`: successful payments and refund state, deduplicated by Stripe identifiers.
- `newsletterSubscriber`: newsletter consent state linked to a contact.

Set the same randomly generated `CONVEX_SYNC_SECRET` in the Next.js environment and the Convex
deployment:

```bash
npx convex env set CONVEX_SYNC_SECRET your_long_random_secret
```

The contact form and Turnstile-protected newsletter endpoint write through server-only Convex
mutations. Newsletter records start with `pending` status so a future double-opt-in confirmation
flow can activate them without treating an unconfirmed request as consent.

### Stripe webhook

Configure Stripe to send these events to `/api/stripe/webhook`:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `refund.created`

For local testing with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Keep this listener running while testing local portal changes. Without a running listener or a
registered reachable Stripe webhook endpoint, Stripe changes cannot reach the local app or Convex.

Copy the CLI's `whsec_...` value to `STRIPE_WEBHOOK_SECRET`. Checkout and subscription events
upsert the contact and donor, `invoice.paid` records each received monthly donation, and refund
events update the original donation instead of deleting financial history.

Subscription webhooks retrieve the latest Stripe subscription before synchronizing. A change to
the recurring amount, price, quantity, status, purpose, or cancellation setting closes the previous
`donationSubscription` version and inserts a new one, atomically updating the donor's current
subscription. Unchanged states and repeated webhook deliveries do not add history rows; older
events cannot overwrite newer recorded states. Only subscriptions with `source: donation-page`
metadata are synchronized. A single monthly fixed-price item is supported, including its quantity.
Unsupported donation prices fail the webhook explicitly so Stripe can retry after correction.
Invoice payments remain separate financial records and never overwrite the recurring amount with
a prorated payment. History begins with the first synchronization after this table is deployed;
past subscription changes are not reconstructed from old payments.

Run the subscription persistence tests without writing to a real Convex deployment:

```bash
npx playwright test tests/e2e/subscriptions.spec.ts
```

## Testing payments

Use **Playwright** for the localized donation form, redirect, receipt page, webhook boundary, and PDF
download. Use the Stripe CLI for signed webhook testing against Stripe test mode.

The Playwright suites use an isolated Next.js output directory and a local Stripe API fixture:

```bash
npm run test:e2e:dev
npm run test:e2e:production
npm run test:e2e
```
