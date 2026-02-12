# -------- Stage 1: Build --------
FROM oven/bun:1 AS js-build
WORKDIR /src

COPY frontend/bun.lock frontend/package.json ./
RUN bun install

COPY frontend/vite.config.ts frontend/tsconfig.json frontend/index.html ./
COPY frontend/public ./public
COPY frontend/src ./src

RUN bun --bun run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS net-build
WORKDIR /src

COPY backend/*.slnx ./
COPY --from=js-build /src/dist Wavenet.Signature/wwwroot/
COPY backend/Wavenet.Signature/*.csproj Wavenet.Signature/
RUN dotnet restore

COPY backend .
RUN dotnet publish Wavenet.Signature/Wavenet.Signature.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=net-build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "Wavenet.Signature.dll"]