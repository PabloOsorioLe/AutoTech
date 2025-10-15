using Microsoft.EntityFrameworkCore;
using BackendCore.Models;

namespace BackendCore.Data
{
    public class BackendCoreContext : DbContext
    {
        public BackendCoreContext(DbContextOptions<BackendCoreContext> options)
            : base(options)
        {
        }
        public DbSet<Producto> Productos { get; set; } // Mapea la tabla Products
        public DbSet<Venta> Ventas { get; set; }
        public DbSet<DetalleVenta> DetalleVentas { get; set; }
        public DbSet<Pago> Pagos { get; set; }
        public DbSet<Categoria> Categorias { get; set; }

        public DbSet<User> Users { get; set; } = default!;
        public DbSet<Role> Roles { get; set; } = default!;
        public DbSet<UserRole> UserRoles { get; set; } = default!;
        public DbSet<Permission> Permissions { get; set; } = default!;
        public DbSet<RolePermission> RolePermissions { get; set; } = default!;
        public DbSet<BackendCore.Models.System> Systems { get; set; } = default!;
        public DbSet<UserToken> UserTokens { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasKey(u => u.RegID);

            modelBuilder.Entity<Role>()
                .HasKey(r => r.RegID);

            modelBuilder.Entity<UserRole>()
                .HasKey(ur => ur.RegID);

            modelBuilder.Entity<Permission>()
                .HasKey(p => p.RegID);

            modelBuilder.Entity<RolePermission>()
                .HasKey(rp => rp.RegID);

            modelBuilder.Entity<BackendCore.Models.System>()
                .HasKey(s => s.RegID);
        }

    }
}
