using System;
using System.Linq;
using imdb.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using imdb.Data;

namespace imdb.Repository
{
  public class DatabaseSeeder : IDatabaseSeeder
  {
    private readonly IServiceProvider _serviceProvider;

    public DatabaseSeeder(IServiceProvider serviceProvider)
    {
      _serviceProvider = serviceProvider;
    }

    //Method to seed the database with data
    public void SeedDatabase()
    {
      using (var scope = _serviceProvider.CreateScope())
      {
        var context = scope.ServiceProvider.GetRequiredService<DatabaseContext>();

        //Seed Movies
        if (!context.Movie.Any())
        {
          var movies = new Movie[]
          {
                new Movie { Title = "The Shawshank Redemption", Year = 1994 },
                new Movie { Title = "Inception", Year = 2010 },
                new Movie { Title = "Pulp Fiction", Year = 1994 },
                new Movie { Title = "The Dark Knight", Year = 2008 }
          };

          context.Movie.AddRange(movies);
          context.SaveChanges();

          //Seed Users
          if (!context.Users.Any())
          {
            var users = new ApplicationUser[]
            {
                new ApplicationUser { Id = "user1", UserName = "SadUser", Email = "user1@example.com" },
                new ApplicationUser { Id = "user2", UserName = "HappyUser", Email = "user2@example.com" }
            };

            context.Users.AddRange(users);
            context.SaveChanges();
          }

          //Seed Reviews
          if (!context.Review.Any())
          {
            var reviews = new Review[]
            {
                  new Review { MovieId = movies[0].Id, UserId = "user1", Rate = 5, Comment = "A masterpiece that stands the test of time." },
                  new Review { MovieId = movies[0].Id, UserId = "user1", Rate = 4, Comment = "Mind-bending and visually stunning." },
                  new Review { MovieId = movies[1].Id, UserId = "user2", Rate = 5, Comment = "A genre-defying classic with memorable characters." },
                  new Review { MovieId = movies[2].Id, UserId = "user2", Rate = 4, Comment = "Heath Ledger's Joker is iconic." },
                  new Review { MovieId = movies[3].Id, UserId = "user1", Rate = 5, Comment = "An intense and gripping cinematic experience." }
            };

            context.Review.AddRange(reviews);
            context.SaveChanges();
          }
        }
      }
    }
  }
}
