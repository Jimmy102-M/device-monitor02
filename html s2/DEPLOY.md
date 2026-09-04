# Publish Pulseboard

Pulseboard has a browser dashboard and an official OAuth scaffold. It does not create artificial followers, likes, views, or guaranteed virality.

## Before publishing

1. Choose a public HTTPS domain.
2. Replace `YOUR_PUBLIC_DOMAIN` in `robots.txt` and `sitemap.xml`.
3. Set `PUBLIC_URL` to that HTTPS URL.
4. Add Meta and TikTok app credentials from the official developer portals. Never commit `.env`.
5. Register these callbacks in each developer portal:
   - `https://YOUR_PUBLIC_DOMAIN/auth/meta/callback`
   - `https://YOUR_PUBLIC_DOMAIN/auth/tiktok/callback`

## Google

After deployment, open Google Search Console, verify the domain, submit `https://YOUR_PUBLIC_DOMAIN/sitemap.xml`, and request indexing for the home page. Google cannot index `localhost` or a file opened directly from a computer.

## Run locally

```powershell
$env:PORT=4174
$env:PUBLIC_URL="http://localhost:4174"
python server.py
```