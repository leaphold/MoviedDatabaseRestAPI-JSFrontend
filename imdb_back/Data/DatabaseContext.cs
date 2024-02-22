using imdb.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace imdb.Data
{
  public class DatabaseContext : IdentityDbContext<ApplicationUser>
  {
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options){ChangeTracker.LazyLoadingEnabled = false;}
  
    public DbSet<Movie> Movie { get; set; }
    public DbSet<Review> Review { get; set; }

  }
}
