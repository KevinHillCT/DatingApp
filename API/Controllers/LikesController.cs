using System;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController(IUnitOfWork uow) : BaseApiController
{
    [HttpPost("{targetMemberId}")]
    public async Task<IActionResult> ToggleLike(string targetMemberId)
    {
        var sourceMemberId = User.GetMemberId();

        if (string.IsNullOrEmpty(sourceMemberId))
        {
            return BadRequest("No source member ID found.");
        }
    
        if (sourceMemberId == targetMemberId)
            return BadRequest("You cannot like yourself.");

        var existingLike = await uow.LikesRepository.GetMemberLike(sourceMemberId, targetMemberId);
        if (existingLike == null)
        {
            var like = new MemberLike
            {
                SourceMemberId = sourceMemberId,
                TargetMemberId = targetMemberId
            };
            uow.LikesRepository.AddLike(like);
        }
        else
        {
            uow.LikesRepository.DeleteLike(existingLike);
        }

        if (await uow.Complete()) return Ok();

        return BadRequest("Failed to update like");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<MemberLike>>> GetCurrentMemberLikeIds()
    {
        var sourceMemberId = User.GetMemberId();
        if (string.IsNullOrEmpty(sourceMemberId))
        {
            return BadRequest("No source member ID found.");
        }

        return Ok(await uow.LikesRepository.GetCurrentMemberLikeIds(sourceMemberId));
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMemberLikes([FromQuery] LikesParams likesParams)
    {
        likesParams.MemberId = User.GetMemberId();
        var members = await uow.LikesRepository.GetMemberLikes(likesParams);
        return Ok(members);
    }
}
