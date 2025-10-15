using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendCore.Models
{
    [Table("Pagos")]
    public class Pago
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int VentaId { get; set; }

        [Required]
        [StringLength(50)]
        public string Metodo { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Monto { get; set; }

        [ForeignKey("VentaId")]
        public Venta Venta { get; set; }
    }
}