using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;


namespace imdb.Models
{
  public class Movie
  {

    public int Id {get; set;}

    [Required]
    [StringLength(60, MinimumLength = 1, ErrorMessage = "Title cannot be longer than 60 characters and less than 1 character.")]
    public string? Title {get; set;}
    
    [Range(1880, Int32.MaxValue, ErrorMessage = "Year cannot be less than 1880 and not more than current year.")]
    public int Year {get; set;}
    public string? UserId { get; set; }
    [ValidateNever]
    public ICollection<Review>? Reviews {get; set;} = new List<Review>();
  }
}
