using System;
using System.Linq.Expressions;
using API.DTOs;
using API.Entities;

namespace API.Extensions;

public class PhotoExtensions
{


    public static Expression<Func<Photo, PhotoForApprovalDto>> ToDtoProjection()
    {
        return photo => new PhotoForApprovalDto
        {
            Id = photo.Id,
            Url = photo.Url,
            IsApproved = photo.isApproved,
            MemberDisplayName = photo.Member.DisplayName,
            MemberImageUrl = photo.Member.ImageUrl!
        };
    }
}
