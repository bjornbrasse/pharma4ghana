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

Configure a Stripe test secret, one Stripe Price ID for every preset amount, and the legal
organization details used on donation receipts. Keep donations disabled until those values have
been verified:

```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_DONATIONS_ENABLED=false
```

Set `NEXT_PUBLIC_DONATIONS_ENABLED=true` only when the Stripe and receipt configuration is ready.
Successful Checkout Sessions are retrieved directly from Stripe, so this flow does not require a
database. The receipt page and PDF are available only when Stripe reports the donation as paid.
In development, the donation page remains accessible when donations are disabled so the interface
can be reviewed; checkout remains disabled. In production, the disabled donation page redirects to
the localized home page and the checkout API returns `503`.

## Testing payments

Use **Vitest** for unit tests around amount validation, environment configuration, and paid-session
receipt mapping. Use **Playwright** for the localized donation form, redirect, receipt page, and PDF
download. Run the end-to-end flow against Stripe test mode; use the Stripe CLI when webhook-driven
fulfilment is added later.

The Playwright suites use an isolated Next.js output directory and a local Stripe API fixture:

```bash
npm run test:e2e:dev
npm run test:e2e:production
npm run test:e2e
```
