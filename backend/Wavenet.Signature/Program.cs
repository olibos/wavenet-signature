using Azure.Core;
using Azure.Identity;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Graph;
using Wavenet.Signature;
using Wavenet.Signature.Application.User.Queries.GetUserDetails;
using Wavenet.Signature.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(options =>
{
    options.AddServerHeader = false;
});
builder.Configuration.AddJsonFile("appsettings.local.json", optional: true);

builder.Services
    .AddOptions<EntraIdOptions>()
    .BindConfiguration("EntraId");
builder.Services.Configure<HstsOptions>(options =>
{
    options.MaxAge = TimeSpan.FromDays(365);
});
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto |
        ForwardedHeaders.XForwardedHost;

    options.KnownIPNetworks.Clear();
    options.KnownProxies.Clear();
});

var entraOptions = builder.Configuration
    .GetSection("EntraId")
    .Get<EntraIdOptions>() ?? throw new KeyNotFoundException("EntraIdOptions not found");

builder.Services.AddAuthentication(options =>
    {
        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
    })
    .AddCookie(options =>
    {
        options.Cookie.Name = builder.Environment.IsProduction() ? "__Host-auth" : ".auth";
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.Lax;
    })
    .AddOpenIdConnect(options =>
    {
        options.Authority = $"{entraOptions.Instance}{entraOptions.TenantId}/v2.0";
        options.ClientId = entraOptions.ClientId;
        options.ClientSecret = entraOptions.ClientSecret;
        options.CallbackPath = entraOptions.CallbackPath;
        options.SignedOutCallbackPath = entraOptions.SignedOutCallbackPath;
    });

builder.Services.AddAuthorization();
builder.Services.AddKeyedSingleton<TokenCredential>(CredentialType.ManagedIdentity, new DefaultAzureCredential());
builder.Services.AddKeyedSingleton<TokenCredential>(
    CredentialType.Graph,
    (services, _) =>
    {
        var identity = services.GetRequiredKeyedService<TokenCredential>(CredentialType.ManagedIdentity);
        if (entraOptions.ClientSecret is not null)
        {
            return new ClientSecretCredential(entraOptions.TenantId, entraOptions.ClientId, entraOptions.ClientSecret);
        }
        
        return new ClientAssertionCredential(
            entraOptions.TenantId, 
            entraOptions.ClientId,
            async cancellationToken =>
            {
                var tokenContext = new TokenRequestContext(
                    scopes: ["api://AzureADTokenExchange"]
                );
    
                var accessToken = await identity.GetTokenAsync(tokenContext, cancellationToken);
                return accessToken.Token;
            }
        );
    });

builder.Services.AddSingleton<GraphServiceClient>(services =>
    new GraphServiceClient(services.GetRequiredKeyedService<TokenCredential>(CredentialType.Graph)));

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
});

var app = builder.Build();
app.UseForwardedHeaders();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseHttpsRedirection();
app.UseHsts();

app.UseAuthentication();
app.UseAuthorization();
app.MapGetUserDetailsQuery();

app.UseDefaultFiles();
app.UseSecurityHeaders();
app.MapStaticAssets();
app.MapFallback(async context =>
{
    var headers = context.Response.Headers;
    headers.ContentSecurityPolicy =
        "default-src 'none'; " +
        "script-src 'report-sample' 'self'; " +
        "style-src 'report-sample' 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https://purecatamphetamine.github.io/country-flag-icons/; " +
        "manifest-src 'self'; " +
        "connect-src 'self'; " +
        "frame-ancestors 'none'; " +
        "upgrade-insecure-requests";

    headers.XFrameOptions = "DENY";
    headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    headers["Cross-Origin-Opener-Policy"] = "same-origin";
    headers["Cross-Origin-Embedder-Policy"] = "require-corp";
    headers["Permissions-Policy"] = "geolocation=(), camera=(), microphone=()";
    headers.ContentType = "text/html; charset=utf-8";

    await context.Response.SendFileAsync(
        Path.Combine(app.Environment.WebRootPath, "index.html"));
}).RequireAuthorization();

await app.RunAsync();
