# Mihiranga Portfolio

A microservices portfolio platform with photography, videography, software projects, blog, and contact form.

## Architecture

- **Frontend** — Next.js 14 (port 3000)
- **API Gateway** — Spring Cloud Gateway (port 8080)
- **Auth Service** — JWT authentication (port 8081)
- **Portfolio Service** — Projects + Cloudinary media (port 8082)
- **Blog Service** — Markdown blog posts (port 8083)
- **Contact Service** — Contact form + email (port 8084)
- **MongoDB** — Shared database instance (port 27017)

## Quick Start (local)

```bash
cp .env.example .env
docker compose up --build
```

Open http://localhost:3000 — Default admin: `mihiranga` / `admin123`

## Deploy to production (go live on the internet)

See **[docs/DEPLOY.md](docs/DEPLOY.md)** for step-by-step instructions to deploy on:
- **Vercel** (frontend) + **VPS** (backend) — recommended
- **Single VPS** with Docker + automatic HTTPS

Copy `.env.production.example` to `.env` on your server and fill in your domain and secrets.

### Local development (without Docker)

**Backend services** (each in its directory):

```bash
cd services/auth-service && mvn spring-boot:run
cd services/portfolio-service && mvn spring-boot:run
cd services/blog-service && mvn spring-boot:run
cd services/contact-service && mvn spring-boot:run
cd api-gateway && mvn spring-boot:run
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | No | Get JWT token |
| `/api/portfolio/type/{type}` | GET | No | List projects by type |
| `/api/portfolio/category/{category}` | GET | No | List projects by category |
| `/api/portfolio` | POST | JWT | Create project |
| `/api/portfolio/{id}` | PUT/DELETE | JWT | Update/delete project |
| `/api/blog` | GET | No | List published posts |
| `/api/blog/{slug}` | GET | No | Get post by slug |
| `/api/blog` | POST | JWT | Create post |
| `/api/contact` | POST | No | Submit contact form |
| `/api/contact` | GET | JWT | List messages |

## Environment Variables

See `.env.example` for all configuration options.
