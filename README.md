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
In development, the donation page remains accessible when donations are disabled so the interface
can be reviewed; checkout remains disabled. In production, the disabled donation page redirects to
the localized home page and the checkout API returns `503`.

## Convex donor management

Create or connect a Convex deployment:

```bash
npm run convex:dev
```

The Convex schema contains exactly four application tables:

- `contact`: normalized identities shared by contact, newsletter, and donor records.
- `donor`: Stripe customer and current monthly-subscription information.
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

Copy the CLI's `whsec_...` value to `STRIPE_WEBHOOK_SECRET`. Checkout and subscription events
upsert the contact and donor, `invoice.paid` records each received monthly donation, and refund
events update the original donation instead of deleting financial history.

## Testing payments

Use **Playwright** for the localized donation form, redirect, receipt page, webhook boundary, and PDF
download. Use the Stripe CLI for signed webhook testing against Stripe test mode.

The Playwright suites use an isolated Next.js output directory and a local Stripe API fixture:

```bash
npm run test:e2e:dev
npm run test:e2e:production
npm run test:e2e
```
