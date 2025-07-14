using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace TaskFunctions.Services;

/// <summary>
/// Provides functionality to validate a Microsoft access token and retrieve user information from Microsoft Graph.
/// </summary>
public class MicrosoftTokenValidator
{
    private readonly HttpClient _httpClient;

    /// <summary>
    /// Initializes a new instance of the <see cref="MicrosoftTokenValidator"/> class.
    /// </summary>
    /// <param name="httpClient">The <see cref="HttpClient"/> used to send requests to Microsoft Graph.</param>
    public MicrosoftTokenValidator(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    /// <summary>
    /// Validates the provided Microsoft access token and retrieves user information from Microsoft Graph.
    /// </summary>
    /// <param name="accessToken">The Microsoft access token to validate.</param>
    /// <returns>
    /// A tuple containing:
    /// <list type="bullet">
    /// <item><description><c>IsValid</c>: <c>true</c> if the token is valid; otherwise, <c>false</c>.</description></item>
    /// <item><description><c>ExternalId</c>: The user's unique identifier from Microsoft Graph, or <c>null</c> if invalid.</description></item>
    /// <item><description><c>DisplayName</c>: The user's display name, or <c>null</c> if invalid.</description></item>
    /// <item><description><c>Email</c>: The user's email address, or <c>null</c> if invalid.</description></item>
    /// </list>
    /// </returns>
    public async Task<(bool IsValid, string? ExternalId, string? DisplayName, string? Email)> ValidateAndGetUserAsync(string accessToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "https://graph.microsoft.com/v1.0/me");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode)
            return (false, null, null, null);

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        var externalId = root.GetProperty("id").GetString();
        var displayName = root.GetProperty("displayName").GetString();
        var email = root.TryGetProperty("mail", out var mailProp) && !string.IsNullOrEmpty(mailProp.GetString())
            ? mailProp.GetString()
            : root.GetProperty("userPrincipalName").GetString();

        return (true, externalId, displayName, email);
    }
}