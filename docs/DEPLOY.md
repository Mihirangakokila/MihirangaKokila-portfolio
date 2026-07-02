# Deploy to the Internet (Step 1)

Get your portfolio live on a public URL so Google can index it.

Two options — pick one:

| Option | Frontend | Backend | Cost | Difficulty |
|--------|----------|---------|------|------------|
| **A — Recommended** | Vercel (free) | VPS or Railway | ~$5–12/mo for server | Medium |
| **B — All-in-one** | Same VPS | Same VPS | ~$5–12/mo | Medium |

---

## Before you start

1. **Buy a domain** (e.g. `mihirangakokila.com`) from Namecheap, Cloudflare, or Google Domains.
2. **Push this project to GitHub** (required for Vercel; useful for VPS too).

```powershell
cd e:\mihiranga-portfolio
git init
git add .
git commit -m "Initial portfolio deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mihiranga-portfolio.git
git push -u origin main
```

---

## Option A — Frontend on Vercel + Backend on a VPS

Best balance: free HTTPS frontend, full control over Java microservices.

### Part 1: Deploy backend (API)

**1. Rent a small VPS** (any one):
- [Hetzner](https://www.hetzner.com/cloud) — CX22 (~€4/mo)
- [DigitalOcean](https://www.digitalocean.com) — Basic Droplet ($6/mo)
- [Linode](https://www.linode.com)

Choose **Ubuntu 22.04**, note the **public IP address**.

**2. Point DNS for API subdomain**

In your domain registrar DNS panel:

| Type | Name | Value |
|------|------|-------|
| A | `api` | `YOUR_VPS_IP` |

Example: `api.mihirangakokila.com` → `123.45.67.89`

**3. SSH into the server and install Docker**

```bash
ssh root@YOUR_VPS_IP

curl -fsSL https://get.docker.com | sh
apt install -y docker-compose-plugin git
```

**4. Clone repo and configure**

```bash
git clone https://github.com/YOUR_USERNAME/mihiranga-portfolio.git
cd mihiranga-portfolio
cp .env.production.example .env
nano .env
```

Edit `.env` — minimum changes:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
CORS_ALLOWED_ORIGINS=https://example.com,https://www.example.com
JWT_SECRET=your-long-random-secret-here
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**5. Start backend only**

```bash
docker compose -f docker-compose.backend.yml --env-file .env up -d --build
```

**6. Add HTTPS with Caddy on the VPS** (quick manual proxy)

```bash
apt install -y caddy
```

Create `/etc/caddy/Caddyfile`:

```
api.example.com {
    reverse_proxy localhost:8080
}
```

```bash
systemctl reload caddy
```

Test: `curl https://api.example.com/api/blog` should return `[]`.

---

### Part 2: Deploy frontend on Vercel

**1. Go to [vercel.com](https://vercel.com)** → Sign up with GitHub.

**2. New Project** → Import your `mihiranga-portfolio` repo.

**3. Configure (important):**

Click **Edit** next to **Root Directory** and select the `frontend` folder.

> If you skip this, Vercel looks at the repo root, won't find Next.js, and shows:
> *"No Next.js version detected"*

| Setting | Value |
|---------|-------|
| Root Directory | **`frontend`** ← required |
| Framework | Next.js (auto-detected after root is set) |

**4. Environment variables** (add before deploy):

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.example.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://example.com` |

**5. Deploy** → Vercel gives you a URL like `https://mihiranga-portfolio.vercel.app`.

**6. Connect your custom domain**

In Vercel → Project → Settings → Domains → Add `example.com` and `www.example.com`.

Vercel shows DNS records to add at your registrar:

| Type | Name | Value |
|------|------|-------|
| A | `@` | Vercel IP (shown in dashboard) |
| CNAME | `www` | `cname.vercel-dns.com` |

**7. Update backend CORS**

On your VPS, update `.env`:

```env
CORS_ALLOWED_ORIGINS=https://example.com,https://www.example.com,https://mihirangakokila.vercel.app
```

Restart gateway:

```bash
docker compose -f docker-compose.backend.yml --env-file .env up -d --build api-gateway
```

**8. Verify**

- Open `https://example.com` — site loads
- Portfolio / Blog / Contact pages work
- Admin login works at `/admin`

---

## Option B — Everything on one VPS (Docker + Caddy)

Single server hosts frontend, API, MongoDB, and auto HTTPS.

**1. DNS records**

| Type | Name | Value |
|------|------|-------|
| A | `@` | `YOUR_VPS_IP` |
| A | `api` | `YOUR_VPS_IP` |

**2. On the VPS**

```bash
git clone https://github.com/YOUR_USERNAME/mihiranga-portfolio.git
cd mihiranga-portfolio
cp .env.production.example .env
nano .env
```

Set all values:

```env
SITE_DOMAIN=example.com
ACME_EMAIL=you@example.com
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_API_URL=https://api.example.com
CORS_ALLOWED_ORIGINS=https://example.com,https://www.example.com
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
```

**3. Deploy**

```bash
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```

Caddy automatically obtains Let's Encrypt certificates for:
- `https://example.com` → frontend
- `https://api.example.com` → API gateway

**4. Verify**

```bash
docker compose -f docker-compose.prod.yml ps
curl https://api.example.com/api/blog
```

Open `https://example.com` in your browser.

---

## After you're live

Your site is now on the public internet. Next steps for Google:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property `https://example.com`
3. Verify ownership (DNS TXT record is easiest)
4. Submit sitemap (we can add `sitemap.xml` in a follow-up step)

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| **No Next.js version detected** | Set **Root Directory** to `frontend` (see below) |
| CORS errors in browser | Add your exact frontend URL to `CORS_ALLOWED_ORIGINS` and restart `api-gateway` |
| API returns connection refused | Check `docker compose ps`, ensure port 8080 is open on VPS firewall |
| Vercel build fails | Ensure Root Directory is set to `frontend` |
| Caddy won't get SSL cert | DNS must point to VPS IP **before** starting Caddy; ports 80/443 must be open |
| Portfolio uploads fail | Set real Cloudinary credentials in `.env` |

### Open firewall ports (VPS)

```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

---

## Quick reference

```bash
# Backend only (Vercel frontend)
docker compose -f docker-compose.backend.yml --env-file .env up -d --build

# Full stack on VPS
docker compose -f docker-compose.prod.yml --env-file .env up -d --build

# View logs
docker compose -f docker-compose.prod.yml logs -f api-gateway

# Stop
docker compose -f docker-compose.prod.yml down
```
