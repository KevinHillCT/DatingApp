using System;

namespace API.DTOs;

public class PhotoForApprovalDto
{
    public required int Id { get; set; }
    public required string Url { get; set; } = null!;
    public string MemberDisplayName { get; set; } = null!;
    public required bool IsApproved { get; set; }
    public string MemberImageUrl { get; set; } = null!;
}
