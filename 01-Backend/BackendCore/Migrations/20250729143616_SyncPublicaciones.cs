using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendCore.Migrations
{
    /// <inheritdoc />
    public partial class SyncPublicaciones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Esta migración es solo para sincronizar el modelo con la base de datos existente.
            // No se realiza ninguna operación porque la tabla 'Publicaciones' ya existe.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // No se revierte nada porque no se aplicaron cambios reales en esta migración.
        }
    }
}
