using Microsoft.AspNetCore.Mvc;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using API.Interfaces;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMemberRepository memberRepository) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            return Ok(await memberRepository.GetMembersAsync());
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await memberRepository.GetMemberByIdAsync(id);
            if (member == null) return NotFound();
            return Ok(member);
        }
        [HttpGet("{memberId}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetPhotosForMember(string memberId)
        {
            return Ok(await memberRepository.GetPhotosForMemberAsync(memberId));
        }
    }
}
