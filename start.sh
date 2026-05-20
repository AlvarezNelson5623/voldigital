#!/usr/bin/env bash
set -euo pipefail

# Simple start script for mono-repo: install and run backend
echo "-> Starting VolDigital backend from ./backend"
cd backend

echo "-> Installing dependencies"
npm ci

echo "-> Running migrations / ensuring uploads dir"
mkdir -p uploads

echo "-> Starting app"
npm start
