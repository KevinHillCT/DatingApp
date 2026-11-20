using System;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using API.Helpers;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace API.Data;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await context.Members.FindAsync(id);
    }

    public async Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams)
    {
        var query = context.Members.AsQueryable();

        if (!string.IsNullOrEmpty(memberParams.Gender))
        {
            query = query.Where(x => x.Gender == memberParams.Gender);
        }

        if (!string.IsNullOrEmpty(memberParams.CurrentMemberId))
        {
            query = query.Where(x => x.Id != memberParams.CurrentMemberId);
        }

        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));

        query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

        query = memberParams.OrderBy switch
        {
            "created" => query.OrderByDescending(x => x.Created),
            _ => query.OrderByDescending(x => x.LastActive)
        };

        return await PaginationHelper.CreateAsync(query, memberParams.PageNumber, memberParams.PageSize);
    }

    public void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string currentMemberId, string memberId)
    {
        var query = context.Members.AsQueryable();
        query = query.Where( x => x.Id.ToString() == memberId );

        if (currentMemberId == memberId) { 
            return await query.SelectMany(x => x.Photos).ToListAsync();
        }
        else {
            return await query
                .SelectMany(x => x.Photos.Where( p=> p.isApproved))
                .ToListAsync();
        }
    }

    public async Task<Member?> GetMemberForUpdates(string id)
    {
        return await context.Members
            .Include(x => x.User)
            .Include(x => x.Photos)
            .SingleOrDefaultAsync(x => x.Id == id);
    }
}
