# AI Agents — Final (Vercel)

Includes:
- ✅ Full AI (OpenAI) for both agents
- ✅ PDF export endpoints (downloadable reports)
- ✅ Shareable links (/share/[id])
- ✅ Saved history (Supabase) OR demo-mode history (no Supabase)
- ✅ Optional Stripe checkout endpoint (upgrade button)

## 1) Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## 2) Minimal env vars (AI only)
Set in `.env.local`:
- OPENAI_API_KEY=...
- OPENAI_MODEL=gpt-4.1-mini (optional)

## 3) Demo mode (no Supabase)
Open home page and click **Start Demo Mode**.
This enables saving history and share links using a local demo key (best-effort in-memory on server).

## 4) Supabase (recommended)
Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
Set env vars:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

Then go to `/login` and use magic link login.

## 5) Stripe (optional)
Set:
- STRIPE_SECRET_KEY
- STRIPE_PRICE_ID
- NEXT_PUBLIC_BASE_URL (e.g. https://your-app.vercel.app)
Button: "Upgrade (Stripe)" will open Checkout.

> Note: Marking users as PRO after payment is normally done with a Stripe webhook.
> This template includes checkout creation only; add webhook later if needed.

## 6) Test API with curl (local)
Immigration:
```bash
curl -X POST http://localhost:3000/api/immigration \
  -H "Content-Type: application/json" \
  -d '{
    "route":"spouse",
    "title":"Test Immigration",
    "applicantName":"Mohsin",
    "partnerName":"Victoria",
    "answers":{"incomeProof":"6 payslips","addressProof":"tenancy + council tax"},
    "trips":[{"from":"2025-03-19","to":"2025-04-11"}]
  }'
```

Property:
```bash
curl -X POST http://localhost:3000/api/property \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Test Property",
    "price":250000,
    "deposit":25000,
    "termYears":30,
    "ratePercent":5,
    "rentMonthly":1400,
    "costsMonthly":{"serviceCharge":0,"insurance":0,"maintenance":0,"other":0}
  }'
```

## 7) Deploy to Vercel
1) Push to GitHub
2) Import in Vercel
3) Add env vars in Vercel → Project Settings → Environment Variables
4) Deploy


## 8) Stripe webhook (auto PRO unlock)
1) Set env var:
- STRIPE_WEBHOOK_SECRET (from Stripe CLI or Dashboard)

2) Create webhook endpoint in Stripe:
- URL: `https://YOUR_DOMAIN/api/stripe/webhook`
- Events:
  - `checkout.session.completed`
  - `invoice.paid` (optional)

### Local testing with Stripe CLI
```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Copy the printed webhook secret into `STRIPE_WEBHOOK_SECRET`.

Then trigger:
```bash
stripe trigger checkout.session.completed
```

> After a successful checkout, the webhook marks the user as PRO in `profiles` and sets monthly credits.

## 9) Usage limits (credits)
- Free: `FREE_CREDITS_PER_DAY` (default 5)
- Pro: `PRO_CREDITS_PER_MONTH` (default 500), auto resets at start of next month (UTC)

The API returns HTTP 402 with message if limit is reached.
