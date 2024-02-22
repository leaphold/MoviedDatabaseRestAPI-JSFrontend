using imdb.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

public class ApplicationUser : IdentityUser
{
  public ICollection<Review>? Reviews { get; set; }
}
