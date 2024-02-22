using imdb.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using imdb.Data;
using imdb.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace imdb.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class MovieController : ControllerBase
  {
    private readonly DatabaseContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public MovieController(DatabaseContext context, UserManager<ApplicationUser> userManager)
    {
      _context = context;
      _userManager = userManager;
      //UPPDATERAR API
    }

    // GET: api/Movie
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MovieDto>>> GetMovies()
    {
      var movies = await _context.Movie
        .Select(m => new MovieDto
            {
            Id = m.Id,
            Title = m.Title,
            Year = m.Year
            })
      .ToListAsync();

      return Ok(movies);
    }

    // GET: api/Movie/3
    [HttpGet("{id}")]
    public async Task<ActionResult<Review>> GetMovie(int id)
    {
      var movie = await _context.Movie
        .Include(m => m.Reviews)
        .FirstOrDefaultAsync(m => m.Id == id);

      if (movie == null)
      {
        return NotFound();
      }

      return Ok(movie);
    }

// PUT: api/Movie/5
[HttpPut("{id}"), Authorize]
public async Task<IActionResult> UpdateMovie(int id, [Bind("Id,Title,Year")] Movie movieUpdateRequest)
{
    if (id != movieUpdateRequest.Id)
    {
        return BadRequest("Mismatched movie ID.");
    }

    var movie = await _context.Movie.FindAsync(id);
    if (movie == null)
    {
        return NotFound();
    }

    // Update only the fields that are allowed to change
    movie.Title = movieUpdateRequest.Title;
    movie.Year = movieUpdateRequest.Year;
    // Do not update movie.UserId here to preserve the original value

    try
    {
        await _context.SaveChangesAsync();
        return NoContent(); // Or Ok(movie) to return the updated movie data
    }
    catch (DbUpdateConcurrencyException)
    {
        if (!_context.Movie.Any(e => e.Id == id))
        {
            return NotFound();
        }
        else
        {
            throw;
        }
    }
}

    // POST: api/Movie
    [HttpPost, Authorize]
    public async Task<ActionResult<Movie>> PostMovie([Bind("Title,Year")] Movie movie)
{
    // Assuming 'movie' is the incoming movie data from the request body
    // and Movie is your entity class that includes a UserId property.

    // Capture the UserId from the logged-in user's identity
    movie.UserId = _userManager.GetUserId(User);

    // Add the new movie entity to the DbSet<Movie> in your DbContext
    _context.Movie.Add(movie);

    // Save changes asynchronously to the database
    await _context.SaveChangesAsync();

    // Return a response indicating the movie was created successfully
    // 'GetMovie' is assumed to be an action for retrieving a movie by its ID.
    return CreatedAtAction("GetMovie", new { id = movie.Id }, movie);
}

    // DELETE: api/Movie/5
    [HttpDelete("{id}"), Authorize]
    public async Task<IActionResult> DeleteMovie(int id)
    {
      var movie = await _context.Movie.FindAsync(id);
      if (movie == null)
      {
        return NotFound();
      }

      _context.Movie.Remove(movie);
      await _context.SaveChangesAsync();

      return NoContent();
    }


    [HttpGet("myMovies")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<MovieDto>>> GetMyMovies()
    {
      var userId = _userManager.GetUserId(User);

      if (userId == null)
      {
        return NotFound("User not found");
      }

      // Fetch movies added by the logged-in user
      var movies = await _context.Movie
        .Where(movie => movie.UserId == userId)
        .Select(movie => new MovieDto
            {
            Id = movie.Id,
            Title = movie.Title,
            Year = movie.Year,
            UserId = userId
            })
      .ToListAsync();

      return Ok(movies);
    }





    private bool MovieExists(int id)
    {
      return _context.Movie.Any(e => e.Id == id);
    }
  }
}
