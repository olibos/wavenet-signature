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

            var extension = Path.GetExtension(context.Request.Path).ToLowerInvariant();
            if (extension is not ("" or ".htm" or ".html")) return next();

            headers.ContentSecurityPolicy =
                "default-src 'none'; " +
                "script-src 'report-sample' 'self'; " +
                "style-src 'report-sample' 'self'; " +
                "img-src 'self' data: https://purecatamphetamine.github.io/country-flag-icons/; " +
                "manifest-src 'self'; " +
                "connect-src 'self'; " +
                "frame-ancestors 'none';";

            headers.XFrameOptions = "DENY";
            headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
            headers["Cross-Origin-Opener-Policy"] = "same-origin";
            headers["Cross-Origin-Embedder-Policy"] = "require-corp";
            headers["Permissions-Policy"] = "geolocation=(), camera=(), microphone=(), interest-cohort=()";
            headers["X-Robots-Tag"] = "noindex, nofollow";
            return next();
        });
    }
}