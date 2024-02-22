using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace imdb.Models
{
  public class Review
  {
    public int Id {get; set;}
    
    [Range(1, 5, ErrorMessage = "Rate cannot be less than 1 and not more than 5.")]
    public int Rate {get; set;}
    
    [StringLength(255, MinimumLength = 1, ErrorMessage = "Comment cannot be longer than 255 characters and less than 1 character.")]
    public string? Comment {get; set;}


    public string? UserId { get; set; }

    public ApplicationUser? User { get; set; } // Use ApplicationUser instead of IdentityUser

    [ForeignKey("Movie")]
    public int MovieId{get; set;}
    public Movie? Movie{get; set;}
  }
}
