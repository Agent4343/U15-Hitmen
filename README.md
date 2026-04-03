# U15-Hitmen Fundraiser

Redesigned, mobile-first fundraiser landing page for the Eastern Hitmen U15 AAA team.

## What is included

- Facebook-friendly hero and social CTA
- Conversion-focused upgrades (urgency countdown, fundraising progress, social proof)
- Improved ticket checkout flow (select -> info -> confirm -> success)
- Admin view for order summary (client-side demo)
- Open Graph metadata in `index.html` for better social sharing previews
- Ready for Railway deployment as a Node app

## Local development

```bash
npm install
npm run dev
```

## Environment variables

Create a `.env` file (or set these in Railway):

```bash
# Optional: if omitted, app uses /team-poster.jpg from /public
VITE_TEAM_PHOTO_URL=https://your-team-photo-url
VITE_ADMIN_PASSCODE=your-secret-passcode
VITE_TRAVEL_GOAL=5000
```

### Using your exact fundraiser poster

To use your uploaded team image poster directly:

1. Save the image as `team-poster.jpg`
2. Place it at `public/team-poster.jpg`
3. Do not set `VITE_TEAM_PHOTO_URL` (or remove it)

The app will automatically use `public/team-poster.jpg` first, then fallback to URL/env image.

## Railway deployment

1. Push this repo to GitHub.
2. In Railway, create a new project from the repo.
3. Set build command:
   - `npm install && npm run build`
4. Set start command:
   - `npm run preview -- --host 0.0.0.0 --port $PORT`
5. Add env vars from the section above.

## Stripe integration note

The payment action is still mocked for now. Replace the `handlePay` block in `src/App.jsx`
with Stripe Checkout or Payment Element logic when you are ready to accept live payments.
