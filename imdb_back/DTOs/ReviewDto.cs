namespace imdb.DTOs
{

  public class ReviewDto
  {
    public int Id { get; set; }
    public int Rate { get; set; }
    public string? Comment { get; set; }
    public string? UserId { get; set; }
    public int MovieId { get; set; }
    public string? MovieTitle { get; set; }
    public string? Email { get; set; }
  }


}


// DTO for Review without nested User and Movie
