using System.Security.Claims;
using FastEndpoints;
using Microsoft.Graph;

namespace Wavenet.Signature.Application.User.Queries.GetUserDetails;

[HttpGet("/api/user/")]
public class GetUserDetailsHandler(GraphServiceClient graphClient): EndpointWithoutRequest<GetUserDetailsResponse>
{
    public override async Task<GetUserDetailsResponse> ExecuteAsync(CancellationToken ct)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;
        if (userId == null) ThrowError("User not found", 404);
        
        var userRequest = graphClient.Users[userId];
        var user = await userRequest
            .GetAsync(config =>
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
            }, ct)
            ??  throw new NullReferenceException("User not found");

        byte[]? photoBytes = null;
        try
        {
            var photoStream = await graphClient.Users["56719b94-71ff-49ea-a07a-323204d0fed6"]
                .Photo
                .Content
                .GetAsync(cancellationToken: ct);
        
            if (photoStream != null)
            {
                await using var memoryStream = new MemoryStream();
                await photoStream.CopyToAsync(memoryStream, ct);
                photoBytes = memoryStream.ToArray();
            }
        }
        catch
        {
            /*Ignore no picture error*/
        }
    
        return new GetUserDetailsResponse(
            user.GivenName,
            user.Surname,
            Email: user.Mail ?? user.UserPrincipalName,
            user.JobTitle,
            user.MobilePhone,
            user.StreetAddress,
            user.City,
            user.PostalCode,
            user.Country,
            photoBytes);
    }
}