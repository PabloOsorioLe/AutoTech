using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendCore.Migrations
{
    /// <inheritdoc />
    public partial class AgregarTelefonoAPublicacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Telefono",
                table: "Publicaciones",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Telefono",
                table: "Publicaciones");
        }
    }
}
