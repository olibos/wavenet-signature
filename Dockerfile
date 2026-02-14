# -------- Stage 1: Build --------
FROM oven/bun:1 AS js-build
WORKDIR /src

COPY frontend/bun.lock frontend/package.json ./
RUN bun install

COPY frontend/vite.config.ts frontend/tsconfig.json frontend/index.html ./
COPY frontend/public ./public
COPY frontend/src ./src

RUN bun --bun run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS base-aot

# Install Native AOT prerequisites
RUN apt-get update && apt-get install -y --no-install-recommends \
        clang \
        gcc \
        libc6-dev \
        libstdc++-14-dev \
        make \
    && rm -rf /var/lib/apt/lists/*

# Set WORKDIR for builds
WORKDIR /src

FROM base-aot AS net-build

ARG BUILD_CONFIGURATION=Release

WORKDIR /src

COPY backend/*.slnx ./
COPY --from=js-build /src/dist Wavenet.Signature/wwwroot/
COPY backend/Wavenet.Signature/*.csproj Wavenet.Signature/
RUN dotnet restore

COPY backend .
RUN dotnet publish Wavenet.Signature/Wavenet.Signature.csproj \
    -c $BUILD_CONFIGURATION \
    -o /app/publish \
    -p:PublishAot=true \
    -p:StripSymbols=true \
    -p:UseAppHost=true \
    -p:InvariantGlobalization=true \
    -p:IlcGenerateStackTraceData=false \
    -p:DebugType=None \
    -p:EnableCompressionInSingleFile=true \
    -p:TrimMode=full

FROM mcr.microsoft.com/dotnet/runtime-deps:10.0-noble-chiseled
WORKDIR /app
COPY --from=net-build /app/publish .
# Run as non-root user
USER 10001
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["./Wavenet.Signature"]