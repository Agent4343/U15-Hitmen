# U15-Hitmen Fundraiser

Redesigned, mobile-first fundraiser landing page for the Eastern Hitmen U15 AAA team.

## What is included

- Facebook-friendly hero and social CTA
- Conversion-focused upgrades (urgency countdown, social proof, supporter wall)
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
# Optional: if omitted, app uses /images/hitmen.jpg from /public
VITE_TEAM_PHOTO_URL=https://your-team-photo-url
VITE_ADMIN_PASSCODE=your-secret-passcode
```

### Using your exact fundraiser poster

The app now defaults to:

- `public/images/hitmen.jpg`

If you want to replace it:

1. Keep the same file name/path (`public/images/hitmen.jpg`) **or**
2. Set `VITE_TEAM_PHOTO_URL` to another hosted image URL.

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
