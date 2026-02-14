namespace Wavenet.Signature.Application.User.Queries.GetUserDetails;

using System.Security.Claims;
using Microsoft.Graph;

public static class GetUserDetailsHandler
{
    public static RouteHandlerBuilder MapGetUserDetailsQuery(this WebApplication app)
        => app.MapGet("/api/user", Handler)
            .RequireAuthorization()
            .WithName("GetUserDetails");

    private static async Task<IResult> Handler(
        ClaimsPrincipal user,
        GraphServiceClient graphClient,
        CancellationToken cancellationToken)
    {
        var userId = user.Claims
            .FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier")
            ?.Value;

        if (userId is null) return Results.NotFound("User not found");

        var graphUser = await graphClient.Users[userId]
            .GetAsync(
                config =>
                {
                    config.QueryParameters.Select =
                    [
                        "givenName",
                        "surname",
                        "mail",
                        "userPrincipalName",
                        "jobTitle",
                        "mobilePhone",
                        "streetAddress",
                        "city",
                        "postalCode",
                        "country"
                    ];
                },
                cancellationToken);

        if (graphUser is null) return Results.NotFound("User not found");

        byte[]? photoBytes = null;
        try
        {
            var photoStream = await graphClient.Users[userId]
                .Photo
                .Content
                .GetAsync(cancellationToken: cancellationToken);

            if (photoStream is not null)
            {
                await using var memoryStream = new MemoryStream();
                await photoStream.CopyToAsync(memoryStream, cancellationToken);
                photoBytes = memoryStream.ToArray();
            }
        }
        catch
        {
            // Ignore missing photo
        }

        var response = new GetUserDetailsResponse(
            graphUser.GivenName,
            graphUser.Surname,
            Email: graphUser.Mail ?? graphUser.UserPrincipalName,
            graphUser.JobTitle,
            graphUser.MobilePhone,
            graphUser.StreetAddress,
            graphUser.City,
            graphUser.PostalCode,
            graphUser.Country,
            photoBytes);

        return Results.Ok(response);
    }
}