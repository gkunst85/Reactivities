using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
      // public class DataContext : DbContext
      public class DataContext : IdentityDbContext<AppUser>
      {
            // Create Table
            public DbSet<Value> Values { get; set; }
            public DbSet<Activity> Activities { get; set; }
            public DbSet<UserActivity> UserActivities { get; set; }
            public DbSet<Photo> Photos { get; set; }

            public DataContext(DbContextOptions options) : base(options) { }

            // Add data to tables
            protected override void OnModelCreating(ModelBuilder builder)
            {
                  // Needed for IdentityDbContext
                  // Allows us when we create our migration to give our AppUser a primary key
                  base.OnModelCreating(builder);


                  builder.Entity<UserActivity>(x => x.HasKey(ua => new { ua.AppUserId, ua.ActivityId }));

                  // Defina a many to one to many relationships
                  builder.Entity<UserActivity>().HasOne(u => u.AppUser)
                                                .WithMany(a => a.UserActivities)
                                                .HasForeignKey(u => u.AppUserId);

                  builder.Entity<UserActivity>().HasOne(a => a.Activity)
                                                .WithMany(u => u.UserActivities)
                                                .HasForeignKey(a => a.ActivityId);

                  // Enters data to the database 
                  builder.Entity<Value>()
                      .HasData(
                          new Value { Id = 1, Name = "Value 101" },
                          new Value { Id = 2, Name = "Value 102" },
                          new Value { Id = 3, Name = "Value 103" });
            }
      }
}