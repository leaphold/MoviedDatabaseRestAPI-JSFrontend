namespace imdb.DTOs

{

  public class MovieDto
  {
    public int Id { get; set; }
    public string Title { get; set; }
    public int Year { get; set; }
    public string? UserId { get; set; }
  }

}
// DTO for Movie without reviews nesting
