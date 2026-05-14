# Deployment Guide — PN Das Telecaller App

## Quick Deploy (Copy-Paste)

After making changes locally, run this single command from the project directory:

```bash
git add -A && git commit -m "update" && git push origin main && ssh root@187.127.163.159 "cd /root/TELECALLER-APP && git pull origin main && docker compose up -d --build"
```

---

## Step-by-Step

### 1. Commit your changes (local machine)

```bash
cd "/Users/ritam/LEAD INTELLIGENCE/lead-intelligence"
git add -A
git commit -m "your commit message here"
git push origin main
```

### 2. SSH into the VPS

```bash
ssh root@187.127.163.159
```

### 3. Pull & rebuild on the server

```bash
cd /root/TELECALLER-APP
git pull origin main
docker compose up -d --build
```

### 4. Verify it's running

```bash
docker compose ps
docker compose logs --tail 20
```

---

## Server Details

| Item | Value |
|---|---|
| **VPS IP** | `187.127.163.159` |
| **SSH User** | `root` |
| **App Directory** | `/root/TELECALLER-APP` |
| **Live URL** | `https://telecallerapp.duckdns.org` |
| **GitHub Repo** | `socialbpmbed-cell/TELECALLER-APP` |
| **Container Name** | `telecaller-app-telecaller-app-1` |
| **Port** | `3000` (behind Traefik reverse proxy) |
| **Network** | `n8n-bqrh_default` (shared with n8n) |

## Other Services on this VPS

| Service | Directory | Purpose |
|---|---|---|
| **Traefik** | `/docker/traefik/` | Reverse proxy + SSL |
| **n8n** | `/docker/n8n-bqrh/` | Webhook workflows |

## Troubleshooting

### App not loading after deploy
```bash
# Check container status
docker compose ps

# Check logs for errors
docker compose logs --tail 50

# Restart the container
docker compose restart
```

### Need to check environment variables
```bash
cat /root/TELECALLER-APP/.env
```

### Force a full rebuild (no cache)
```bash
cd /root/TELECALLER-APP
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Check if Traefik is routing correctly
```bash
cd /docker/traefik
docker compose logs --tail 20
```
