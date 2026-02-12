using Azure.Core;
using Azure.Identity;
using FastEndpoints;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.Identity.Web;
using Wavenet.Signature;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("appsettings.local.json", optional: true);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddFastEndpoints();
var entraIdSection = builder.Configuration.GetSection("EntraId");
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto |
        ForwardedHeaders.XForwardedHost;

    options.KnownIPNetworks.Clear();
    options.KnownProxies.Clear();
});
builder.Services.Configure<MicrosoftIdentityOptions>(entraIdSection);
builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApp(entraIdSection);


builder.Services.AddAuthorization(options => options.FallbackPolicy = options.DefaultPolicy);
builder.Services.AddKeyedSingleton<TokenCredential>(CredentialType.ManagedIdentity, new DefaultAzureCredential());
builder.Services.AddKeyedSingleton<TokenCredential>(
    CredentialType.Graph,
    (services, _) =>
    {
        var identity = services.GetRequiredKeyedService<TokenCredential>(CredentialType.ManagedIdentity);
        var entraId = services.GetRequiredService<IOptions<MicrosoftIdentityOptions>>().Value;

        if (entraId.ClientSecret is not null)
        {
            return new ClientSecretCredential(entraId.TenantId, entraId.ClientId, entraId.ClientSecret);
        }
        
        return new ClientAssertionCredential(
            tenantId: entraId.TenantId,
            clientId: entraId.ClientId,
            async cancellationToken =>
            {
                var tokenContext = new TokenRequestContext(
                    scopes: [$"api://AzureADTokenExchange"]
                );
    
                var accessToken = await identity.GetTokenAsync(tokenContext, cancellationToken);
                return accessToken.Token;
            }
        );
    });

builder.Services.AddSingleton<GraphServiceClient>(services =>
    new GraphServiceClient(services.GetRequiredKeyedService<TokenCredential>(CredentialType.Graph)));
var app = builder.Build();
app.UseForwardedHeaders();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// Redirect unauthenticated users to login
app.Use(async (HttpContext context, Func<Task> next) =>
{
    if (!context.User.Identity?.IsAuthenticated ?? true)
    {
        var path = context.Request.Path.Value?.ToLower();
        if (path?.StartsWith("/signin-oidc") == false && 
            path?.StartsWith("/signout-callback-oidc") == false &&
            path?.StartsWith("/site.webmanifest") == false)
        {
            context.Response.Redirect($"/MicrosoftIdentity/Account/SignIn?redirectUri={Uri.EscapeDataString(context.Request.Path)}");
            return;
        }
    }
    
    await next();
});

app.MapGet("/site.webmanifest", async context =>
    {
        await context.Response.SendFileAsync(
            Path.Combine(app.Environment.WebRootPath, "site.webmanifest"));
    })
    .AllowAnonymous();

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");
app.UseFastEndpoints();
await app.RunAsync();
