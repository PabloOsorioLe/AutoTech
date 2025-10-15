using BackendCore.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Venta
{
    [Key]
    public int Id { get; set; }

    [Required]
    public DateTime Fecha { get; set; } = DateTime.Now;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Total { get; set; }

    // Relación con DetalleVenta (uno a muchos)
    public List<DetalleVenta> Detalles { get; set; } = new List<DetalleVenta>();  // Propiedad de navegación (detalles de la venta)

    // Relación con Pago (uno a muchos)
    public List<Pago> Pagos { get; set; } = new List<Pago>();  // Relación con los pagos
}
