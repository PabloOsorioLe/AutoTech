using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendCore.Models
{
    [Table("Productos")]
    public class Producto
    {
        public int Id { get; set; }
        public string Nombre { get; set; }

        [Required]
        public int CategoriaID { get; set; } // FK requerida
        public Categoria? Categoria { get; set; } // navegación no requerida

        public string Codigo { get; set; }
        public decimal Precio { get; set; }
        public int Stock { get; set; }
        public string Proveedor { get; set; }
        public string Ubicacion { get; set; }
        public DateTime? FechaIngreso { get; set; }
        public string? Descripcion { get; set; }
        public string? ImagenUrl { get; set; }
        public int Estado { get; set; } = 1;
    }
}
