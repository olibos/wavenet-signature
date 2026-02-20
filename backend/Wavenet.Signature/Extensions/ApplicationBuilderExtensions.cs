namespace Wavenet.Signature.Extensions;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder app)
    {
        return app.Use(static (context, next) =>
        {
            var headers = context.Response.Headers;
            headers.XContentTypeOptions = "nosniff";
            headers["Cross-Origin-Resource-Policy"] = "same-site";
            headers.XXSSProtection = "0";
            headers["X-Robots-Tag"] = "noindex, nofollow";

            return next();
        });
    }
}