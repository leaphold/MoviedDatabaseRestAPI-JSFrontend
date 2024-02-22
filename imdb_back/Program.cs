using Swashbuckle.AspNetCore.Filters;
using System.Text.Json.Serialization;
using imdb.Data;
using imdb.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers()
  .AddJsonOptions(options =>
      { // To avoid cycles in the data
      options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
      });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => 
    {
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
        {
        In = ParameterLocation.Header,
        Name= "Authorization",
        Type = SecuritySchemeType.ApiKey
        });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
    }
    );
//Seed the database
builder.Services.AddScoped<IDatabaseSeeder, DatabaseSeeder>();
//Add Authorization
builder.Services.AddAuthorization();

//Add Identity(applicationuser) to the database
builder.Services.AddIdentityApiEndpoints<ApplicationUser>()
  .AddEntityFrameworkStores<DatabaseContext>();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseCors(builder => builder
     .AllowAnyOrigin()
     .AllowAnyMethod()
     .AllowAnyHeader());

// Map the Identity API endpoints
app.MapIdentityApi<ApplicationUser>();
app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();

//Seed the database
using (var scope=app.Services.CreateScope())
{
  var seeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeeder>();
  seeder.SeedDatabase();
}

app.Run();
