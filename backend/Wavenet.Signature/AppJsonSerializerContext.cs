namespace Wavenet.Signature;

using System.Text.Json.Serialization;

using Wavenet.Signature.Application.User.Queries.GetUserDetails;

[JsonSerializable(typeof(GetUserDetailsResponse))]
internal partial class AppJsonSerializerContext : JsonSerializerContext
{
}