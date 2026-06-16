#!/bin/bash
set -euo pipefail

COMPOSE_FILE="${1:-docker-compose.prod.yml}"

if [ ! -f .env ]; then
  echo "Missing .env file. Copy .env.production.example to .env and edit it first."
  exit 1
fi

echo "Deploying with $COMPOSE_FILE ..."
docker compose -f "$COMPOSE_FILE" --env-file .env up -d --build

echo ""
echo "Deployment started. Check status:"
docker compose -f "$COMPOSE_FILE" ps
