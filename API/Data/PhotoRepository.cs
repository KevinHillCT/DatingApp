using System;
using API.Interfaces;
using API.DTOs;
using Microsoft.EntityFrameworkCore;
using API.Entities;
using API.Extensions;
namespace API.Data;

public class PhotoRepository(AppDbContext context) : IPhotoRepository
{
    public async Task<Photo?> GetPhotoById(int id)
    {
        return await context.Photos.FindAsync(id);
    }

    public async Task<IReadOnlyList<PhotoForApprovalDto>> GetUnapprovedPhotos()
    {
        return await context.Photos
            .Where(p => !p.isApproved)
            .Select(PhotoExtensions.ToDtoProjection())
            .ToListAsync();
    }

    public async Task RemovePhoto(Photo photo)
    {
        context.Photos.Remove(photo);
    }

}
