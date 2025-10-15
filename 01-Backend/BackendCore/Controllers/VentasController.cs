using BackendCore.Data;
using BackendCore.Dtos;
using BackendCore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BackendCore.Controllers
{
    [ApiController]
    [Route("api/ventas")]
    public class VentasController : ControllerBase
    {
        private readonly BackendCoreContext _context;

        public VentasController(BackendCoreContext context)
        {
            _context = context;
        }

        // Método GET para obtener todas las ventas de hoy
        [HttpGet("del-dia")]
        public async Task<IActionResult> ObtenerVentasDelDia()
        {
            var fechaHoy = DateTime.UtcNow.Date;
            var inicioDelDia = fechaHoy;
            var finDelDia = fechaHoy.AddDays(1).AddTicks(-1);

            var ventasDelDia = await _context.Ventas
                .Where(v => v.Fecha >= inicioDelDia && v.Fecha <= finDelDia)
                .Include(v => v.Pagos)
                .Include(v => v.Detalles)
                    .ThenInclude(d => d.Producto)
                .ToListAsync();

            if (ventasDelDia == null || !ventasDelDia.Any())
            {
                return NotFound(new { mensaje = "No se encontraron ventas para el día de hoy." });
            }

            var ventasDetalles = ventasDelDia.Select(venta => new
            {
                id = venta.Id,
                fecha = venta.Fecha,
                total = venta.Total,
                pagos = venta.Pagos.Select(p => new { p.Metodo, p.Monto }),
                detalles = venta.Detalles.Select(d => new
                {
                    Nombre = d.Producto != null ? d.Producto.Nombre : "Producto no disponible",
                    d.PrecioUnitario,
                    d.Cantidad,
                    d.SubTotal
                })
            }).ToList();

            return Ok(ventasDetalles);
        }



        // Método POST para crear una nueva venta
        [HttpPost]
        public async Task<IActionResult> CrearVenta([FromBody] CrearVentaDto dto)
        {
            // Validación de los datos de entrada
            if (dto.Total <= 0 || !dto.Carrito.Any() || dto.Pagos.Sum(p => p.Monto) < dto.Total)
            {
                return BadRequest("Datos inválidos: total no coincide, carrito vacío o suma de pagos incorrecta.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Crear la venta
                var venta = new Venta
                {
                    Total = dto.Total,
                    Fecha = DateTime.UtcNow // ← Así guardarás siempre en UTC
                };
                _context.Ventas.Add(venta);
                await _context.SaveChangesAsync(); // Guarda la venta para obtener el Id

                // Procesar los ítems del carrito
                foreach (var item in dto.Carrito)
                {
                    if (item.Id.HasValue)
                    {
                        var producto = await _context.Productos.FindAsync(item.Id.Value);
                        if (producto == null)
                        {
                            throw new Exception($"Producto con Id {item.Id} no encontrado.");
                        }
                        if (producto.Stock < item.Cantidad)
                        {
                            throw new Exception($"Stock insuficiente para {producto.Nombre}. Stock disponible: {producto.Stock}");
                        }
                        producto.Stock -= item.Cantidad; // Actualizar el stock del producto
                        _context.Productos.Update(producto); // Actualizar producto en la base de datos
                    }

                    // Crear el detalle de la venta (producto comprado)
                    var detalle = new DetalleVenta
                    {
                        VentaId = venta.Id,
                        ProductoId = item.Id,
                        Nombre = item.Nombre,
                        PrecioUnitario = item.Precio,
                        Cantidad = item.Cantidad
                    };
                    _context.DetalleVentas.Add(detalle); // Añadir detalle a la venta
                }

                // Registrar los pagos asociados a la venta
                foreach (var pagoDto in dto.Pagos)
                {
                    var pago = new Pago
                    {
                        VentaId = venta.Id,
                        Metodo = pagoDto.Metodo,
                        Monto = pagoDto.Monto
                    };
                    _context.Pagos.Add(pago); // Añadir pago a la venta
                }

                // Guardar todos los cambios y hacer commit de la transacción
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { Mensaje = "Venta creada exitosamente", VentaId = venta.Id }); // Retornar la respuesta exitosa
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(); // Si ocurre un error, hacer rollback
                return BadRequest(ex.Message); // Retornar el error con el mensaje
            }
        }
    }
}
