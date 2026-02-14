namespace Wavenet.Signature;

public sealed class EntraIdOptions
{
    public string Instance { get; set; } = "https://login.microsoftonline.com/";
    public string TenantId { get; set; } = null!;
    public string ClientId { get; set; } = null!;
    public string? ClientSecret { get; set; }
    public string CallbackPath { get; set; } = "/signin-oidc";
    public string SignedOutCallbackPath { get; set; } = "/signout-callback-oidc";
}