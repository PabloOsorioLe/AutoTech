namespace BackendCore.Dtos
{
    public class CrearVentaDto
    {
        public decimal Total { get; set; }
        public List<CarritoItemDto> Carrito { get; set; } = new List<CarritoItemDto>();
        public List<PagoDto> Pagos { get; set; } = new List<PagoDto>();
    }

    public class CarritoItemDto
    {
        public int? Id { get; set; } // Id del producto, null para personalizados
        public string Nombre { get; set; }
        public decimal Precio { get; set; }
        public int Cantidad { get; set; }
    }

    public class PagoDto
    {
        public string Metodo { get; set; }
        public decimal Monto { get; set; }
    }
}