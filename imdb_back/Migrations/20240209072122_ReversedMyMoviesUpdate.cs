using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace imdb.Migrations
{
    /// <inheritdoc />
    public partial class ReversedMyMoviesUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Movie",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Movie");
        }
    }
}
