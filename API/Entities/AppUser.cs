namespace API.Entities;
using Microsoft.AspNetCore.Identity;

public class AppUser : IdentityUser
{
    public required string DisplayName { get; set; }
    public string? ImageUrl { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }
    // Navigation property to the member associated with this user
    public Member Member { get; set; } = null!;
}
