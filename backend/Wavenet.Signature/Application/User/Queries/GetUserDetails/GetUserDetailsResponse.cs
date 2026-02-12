namespace Wavenet.Signature.Application.User.Queries.GetUserDetails;

public record GetUserDetailsResponse(
    string? FirstName,
    string? LastName,
    string? Email,
    string? JobTitle,
    string? MobilePhone,
    string? StreetAddress,
    string? City,
    string? PostalCode,
    string? Country,
    byte[]? Photo);