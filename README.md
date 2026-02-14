# Wavenet Mail Signature

A small web application to generate signatures. The project contains a React + Vite frontend and a .NET 10 (Native AOT) backend that serves the built frontend and provides authentication via Azure Entra ID + Microsoft Graph.

---

## 🧩 Tech stack

- Backend: .NET 10 (Native AOT), Minimal APIs
- Frontend: React + Vite (TypeScript)
- Build (production): Bun (used in Dockerfile) — npm/yarn/pnpm also supported for local dev
- Auth / API: Azure Entra ID (OpenID Connect) + Microsoft Graph
- Container: Docker

---

## 🚀 Quick start — Local development

Prerequisites:
- .NET SDK 10.0+
- Bun (recommended) or Node.js + npm/yarn/pnpm
- (Optional) Docker for container runs

1. Start the backend

```bash
# from repo root
cd backend
dotnet restore
dotnet run --project Wavenet.Signature/Wavenet.Signature.csproj
```

- Default local HTTP URL: `http://localhost:5015` (see `launchSettings.json`).

2. Start the frontend dev server

```bash
cd frontend
# using Bun (recommended)
bun install
bun run dev

# or using npm
npm install
npm run dev
```

- Frontend dev server: `http://localhost:3000`
- During development the frontend talks to the backend at `http://localhost:5015`.

---

## 📦 Build & run (production / Docker)

Build and run the multi-stage Docker image (frontend is built with Bun inside the image):

```bash
# build image
docker build -t wavenet-signature:latest .

# run (exposes port 8080)
docker run --rm -p 8080:8080 wavenet-signature:latest
```

- App URL (container): `http://localhost:8080`

You can also build manually:
- `cd frontend && bun install && bun run build` (or `npm run build`)
- `dotnet publish backend/Wavenet.Signature/Wavenet.Signature.csproj -c Release -o ./publish`

---

## 🔐 Configuration / environment

Configuration lives in `backend/Wavenet.Signature/appsettings*.json` and `appsettings.local.json` (loaded when present).

Entra ID (Azure AD) settings are expected under the `EntraId` section. Example:

```json
"EntraId": {
  "Instance": "https://login.microsoftonline.com/",
  "TenantId": "<TENANT_ID>",
  "ClientId": "<CLIENT_ID>",
  "ClientSecret": "<CLIENT_SECRET>",
  "CallbackPath": "/signin-oidc",
  "SignedOutCallbackPath": "/signout-callback-oidc"
}
```

Important runtime env vars:
- `ASPNETCORE_ENVIRONMENT` — Development / Production
- `ASPNETCORE_URLS` — overridden to `http://+:8080` in Docker image

---

## 📁 Project layout (important files)

- `backend/Wavenet.Signature/` — .NET API, serves static `wwwroot`
  - `Program.cs` — app entry
  - `appsettings*.json` — config
- `frontend/` — React + Vite app (dev server & production build)
- `Dockerfile` — multi-stage build (bun + dotnet AOT publish)

---

## ℹ️ Notes

- The backend publishes a Native AOT executable for small, fast containers (see `PublishAot` in csproj and Dockerfile).
- OpenAPI (OpenAPI/Swagger UI) is available in Development mode (see `Program.cs`).
- During production the built frontend is placed into the backend `wwwroot` and served by the .NET app.

---

## ✅ Useful commands

- Start backend: `dotnet run --project backend/Wavenet.Signature/Wavenet.Signature.csproj`
- Frontend dev: `cd frontend && bun run dev` (or `npm run dev`)
- Frontend build: `cd frontend && bun run build` (or `npm run build`)
- Docker: `docker build -t wavenet-signature . && docker run -p 8080:8080 wavenet-signature`

---

## Contributing

- Open an issue or submit a PR. Keep changes small and add tests where appropriate.
