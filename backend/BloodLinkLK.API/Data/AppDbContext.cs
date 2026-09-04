using BloodLinkLK.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BloodLinkLK.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<BloodRequest> BloodRequests => Set<BloodRequest>();

    public DbSet<DonorAvailability> DonorAvailabilities =>
        Set<DonorAvailability>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<DonorAvailability>()
            .HasOne<User>()
            .WithOne(u => u.DonorProfile)
            .HasForeignKey<DonorAvailability>(d => d.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BloodRequest>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(b => b.RequesterId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}