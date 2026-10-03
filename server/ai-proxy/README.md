# Hablo Plus AI proxy

A Cloudflare Worker behind the **Hablo Plus** subscription. The app sends tutor requests here, identified by the
subscriber's RevenueCat app user id. The worker:

1. checks with RevenueCat that the user has the `plus` entitlement (cached for 10 minutes),
2. applies a daily request cap per subscriber (`DAILY_REQUEST_LIMIT`),
3. forwards the request to OpenRouter using **your** API key and a fixed model (`MODEL`).

No API key ships in the app, and clients can't choose a more expensive model.

## Costs, roughly

With `deepseek/deepseek-chat` (about $0.14 per million input tokens and $0.28 per million output tokens on OpenRouter,
as of late 2026), a 25-minute session makes 15–30 tutor calls. That's roughly 50k tokens, or about a cent. A learner
doing 4 sessions a week costs about $0.20/month, so a $2.99/month plan leaves plenty of room after store fees. The
daily cap keeps a single runaway client from costing more than a few cents a day.

## Setup

1. **RevenueCat**
   - Create a project and add the iOS and Android apps (bundle id / package `dev.svindland.hablo`).
   - In App Store Connect and the Play Console, create a monthly auto-renewing subscription. Import it into
     RevenueCat, attach it to an entitlement called `plus`, and put it in the **current** offering.
   - Copy the public SDK keys into the app's env (see `.env.example` at the repo root) and the **secret** API key
     (v1) for the worker below.
2. **OpenRouter**: create an API key at https://openrouter.ai/keys and add credits.
3. **Deploy the worker**

   ```bash
   cd server/ai-proxy
   npm install
   npx wrangler login
   npx wrangler kv namespace create USAGE        # paste the id into wrangler.toml
   npx wrangler secret put OPENROUTER_API_KEY
   npx wrangler secret put REVENUECAT_SECRET_KEY
   npx wrangler deploy
   ```

4. Set `EXPO_PUBLIC_AI_PROXY_URL` in the app to the deployed URL (e.g. `https://hablo-ai-proxy.<you>.workers.dev`),
   and make a new build. Plus only appears as an option when the SDK keys and proxy URL are set.

## Notes and limits

- **Identity.** Subscribers are identified by RevenueCat's anonymous app user id (`$RCAnonymousID:…`), a random id
  stored on the device. Malformed ids are rejected, and a per-IP limit runs before any RevenueCat lookup. Still,
  anyone who learned someone's id could use their daily quota, so treat it like a bearer token. For stronger
  guarantees, add App Attest / Play Integrity, or accounts (`Purchases.logIn`) with a signed token. If you add
  accounts, widen `SUBSCRIBER_ID` in `src/index.ts`.
- **RevenueCat lookups.** The v1 `GET /subscribers/{id}` endpoint creates the customer if it doesn't exist. The id
  format check and IP limit keep that from being abused. RevenueCat's v2 API can check entitlements without
  creating customers if you'd rather switch.
- **Privacy.** Tutor prompts (learner answers, chat messages, lesson content) pass through the worker to OpenRouter and
  the model provider. The app asks for consent before enabling a cloud tutor. Mention this in the App Store privacy
  label and privacy policy.
- **Model choice.** Change `MODEL` in `wrangler.toml` and redeploy. Pick a model that follows "respond with a JSON
  object" instructions well; the app validates every response and retries once.
